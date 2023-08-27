import { app } from "electron"
import puppeteer, { Browser, Page } from "puppeteer"
import * as dotenv from "dotenv"
import * as fs from "fs"
import * as path from "path"
import { useMoveToClick } from "../composables/useMoveToClick"
import { getMousePosition, useMouseHelper } from "../composables/useMouseHelper"
import { BaseTweetPlugin } from "@/lib/BaseTweetPlugin"

dotenv.config()

export class TwitterPostBot {
    twitterUsername: string
    twitterPassword: string
    randomArticleChance: number
    tweetMaxDelayInHours: number = 5
    tweetMinDelayInHours: number = 0.5
    browser?: Browser
    page?: Page
    enabledPlugins: any[] = []
    plugins: BaseTweetPlugin[] = []

    constructor() {
        this.twitterUsername = process.env.TWITTER_USERNAME!
        this.twitterPassword = process.env.TWITTER_PASSWORD!
        this.tweetMaxDelayInHours = process.env.TWEET_MAX_DELAY_HOURS ? parseFloat(process.env.TWEET_MAX_DELAY_HOURS) : 0.5
        this.tweetMinDelayInHours = process.env.TWEET_MIN_DELAY_HOURS ? parseFloat(process.env.TWEET_MIN_DELAY_HOURS) : 0.5

        this.randomArticleChance = process.env.RANDOM_ARTICLE_CHANCE ? parseFloat(process.env.RANDOM_ARTICLE_CHANCE) : 0.8

        this.deleteSingletonFiles = this.deleteSingletonFiles.bind(this)
        this.initialize = this.initialize.bind(this)
        this.login = this.login.bind(this)
        this.sendTweet = this.sendTweet.bind(this)
        this.nextTweet = this.nextTweet.bind(this)

        process.on("exit", async () => {
            if (this.browser) {
                await this.browser.close()
            }
            app.exit()
        })
    }

    async deleteSingletonFiles() {
        // delete singleton files in case of crash
        try {
            const files = fs.readdirSync("@/user_data/")
            for (const file of files) {
                if (file.match("Singleton")) {
                    const filePath = path.join("./user_data/", file)
                    console.log(`Removing ${filePath}...`)
                    fs.unlinkSync(filePath)
                }
            }
        } catch (e) {
        }
    }

    async postTweet(tweet: string) {

        await this.page.waitForSelector(".public-DraftStyleDefault-block")
        await this.page.click("[data-testid='tweetTextarea_0RichTextInputContainer']")
        await this.page.type("[data-testid='tweetTextarea_0RichTextInputContainer']", tweet)

        await new Promise(resolve => setTimeout(resolve, 1000))

        const elementHandle = await this.page.$("[aria-label=\"Add post\"]")
        const nextSiblingHandle = await elementHandle?.evaluateHandle(element => element.nextElementSibling)
        await nextSiblingHandle?.asElement()?.click()

        await this.page.waitForSelector("[id*='typeaheadDropdownWrapped-']", {timeout: 1000})
            .then(async () => {
                await this.page.keyboard.press("Escape")
            }).catch(() => {
            })

        const start = getMousePosition()

        await useMoveToClick(this.page, nextSiblingHandle?.asElement()!, start.x, start.y).catch(() => {
            console.log("Unable to send tweet.")
        }).then(async () => {
            console.log("Tweet sent.")
        })
    }

    async initialize() {
        await this.deleteSingletonFiles()

        let puppeteerOpts: any = {
            headless: false,
            userDataDir: "./user_data",
            args: [
                "--disable-infobars", "--no-first-run", "--disable-notifications", "--disable-background-timer-throttling",
                "--disable-backgrounding-occluded-windows", "--disable-breakpad", "--disable-component-extensions-with-background-pages",
                "--disable-extensions", "--disable-features=TranslateUI,BlinkGenPropertyTrees", "--disable-ipc-flooding-protection",
                "--disable-renderer-backgrounding", "--mute-audio", "--no-default-browser-check", "--no-first-run", "--hide-crashed-bubbles",
                "--hide-crashed-restore-bubble", "--noerrdialogs", "--enable-automation", "--disable-blink-features=AutomationControlled",
            ]
        }

        if (process.env.PUPPETEER_EXEC_PATH !== undefined) {
            puppeteerOpts = {
                ...puppeteerOpts,
                executablePath: process.env.PUPPETEER_EXEC_PATH
            }
        }

        await puppeteer.launch(puppeteerOpts).catch(async (err: any) => {
            console.log(err)
            console.log("Failed to launch puppeteer. Exiting...")
            await new Promise(resolve => setTimeout(resolve, 5000))
            process.exit(1)
        }).then(async (browser: any) => {
            if (!browser) {
                console.log("Failed to launch puppeteer. Exiting...")
                await new Promise(resolve => setTimeout(resolve, 5000))
                process.exit(1)
            }
            this.browser = browser
            this.page = await browser.newPage()

            this.page.on("dialog", async dialog => {
                console.log(dialog.message())
                await dialog.dismiss()
            })

            await useMouseHelper(this.page)
            await this.login()
            await this.sendTweet()
            await this.nextTweet()
        })
    }

    async loadPlugins() {
        const pluginsWithChance = process.env.ENABLED_PLUGINS!.split(",")
        for (const pluginWithChance of pluginsWithChance) {
            const [plugin, chance] = pluginWithChance.split(":")
            const pluginClass = require(`../plugins/${plugin}`).default
            const pluginInstance = new pluginClass({chance: parseFloat(chance)})
            this.enabledPlugins.push(plugin)
            this.plugins.push(pluginInstance)
        }

    }

    async nextTweet() {
        setTimeout(this.sendTweet, ( 1000 * 60 * 60 * this.tweetMinDelayInHours ) + ( Math.random() * ( 1000 * 60 * 60 ) * this.tweetMaxDelayInHours ))
    }


    async login() {

        // set user agent and viewport size
        await this.page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36")
        await this.page.setViewport({
            width: Math.floor(1366 + ( Math.random() * 100 )),
            height: Math.floor(768 + ( Math.random() * 100 ))
        })

        // go to twitter login page
        await this.page.goto("https://twitter.com/login")

        // wait for username field to appear, then type username and password
        await this.page.waitForSelector("input[autocomplete='username']", {timeout: 5000})
            .then(async () => {
                await this.page.click("input[autocomplete='username']")
                await this.humanType("input[autocomplete='username']", this.twitterUsername + "\n")
                await this.page.waitForSelector("input[autocomplete='current-password']")
                await this.page.click("input[autocomplete='current-password']")
                await this.humanType("input[autocomplete='current-password']", this.twitterPassword + "\n")
            })
            .catch(() => console.log("Didn't find username field, already logged in?"))
    }

    getRandomDelay(min: number = 200, max: number = 900): number {
        return Math.random() * ( max - min ) + min
    }

    async humanType(selector: string, text: string, delay: number = 100) {
        // type each character with a random delay
        for (const character of text) {
            await this.page.type(selector, character, {delay: this.getRandomDelay(delay, delay + 500)})
        }
    }


    async sendTweet() {
        let plugin: BaseTweetPlugin | undefined

        if (!this.plugins.length) {
            console.log("No plugins enabled.")
            return
        }

        // pick random plugin based on plugin chance
        while (!plugin) {
            plugin = this.plugins[Math.floor(Math.random() * this.plugins.length)]
            if (Math.random() > plugin.chance) {
                plugin = undefined
            }
        }

        console.log(`Rolled plugin: ${plugin.constructor.name}`)

        const tweet = await plugin.generateTweet()
        if (!tweet) {
            console.log("No tweet generated.")
            return
        } else {
            console.log(`Generated tweet: ${tweet}`)
            await this.postTweet(tweet)
            await plugin.confirmTweetSent()
        }
    }
}

