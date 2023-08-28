import { getMousePosition, useMouseHelper } from "@/composables/useMouseHelper"
import { useMoveToClick } from "@/composables/useMoveToClick"
import puppeteer, { Browser, Page } from "puppeteer"
import * as fs from "fs"
import * as path from "path"
import { app } from "electron"
import { BaseDestinationPlugin } from "@/lib/BaseDestinationPlugin"

import { useRandomDelay } from "@/composables/useRandomDelay"

export class TwitterPuppeteer extends BaseDestinationPlugin {

    name = "TwitterPuppeteer"

    twitterUsername: string
    twitterPassword: string
    browser?: Browser
    page?: Page

    constructor(options?: any) {
        super(options)
        this.twitterUsername = process.env.TWITTER_USERNAME!
        this.twitterPassword = process.env.TWITTER_PASSWORD!

        this.login = this.login.bind(this)
        this.deleteSingletonFiles = this.deleteSingletonFiles.bind(this)

        process.on("exit", async () => {
            if (this.browser) {
                await this.browser.close()
            }
            app.exit()
        })
    }


    async initialize() {
        await this.deleteSingletonFiles()

        if (!this.twitterUsername || !this.twitterPassword) {
            this.log("Twitter username or password not set. Cannot enable TwitterPuppeteer plugin. Exiting...")
            await new Promise(resolve => setTimeout(resolve, 5000))
            process.exit(1)
        }

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
            this.log(err)
            this.log("Failed to launch puppeteer. Exiting...")
            await new Promise(resolve => setTimeout(resolve, 1000))
            process.exit(1)
        }).then(async (browser: any) => {
            if (!browser) {
                this.log("Failed to launch puppeteer. Exiting...")
                await new Promise(resolve => setTimeout(resolve, 1000))
                process.exit(1)
            }
            this.browser = browser
            this.page = await browser.newPage()


            this.browser.on("disconnected", async () => {
                this.log("Browser disconnected. Exiting...")
                await new Promise(resolve => setTimeout(resolve, 1000))
                process.exit()

            })

            this.page.on("dialog", async dialog => {
                this.log(dialog.message())
                await dialog.dismiss()
            })

            await useMouseHelper(this.page)
            await this.login()
            this.log("Logged in.")
        })
    }


    async deleteSingletonFiles() {
        // delete singleton files in case of crash
        try {
            const files = fs.readdirSync("@/user_data/")
            for (const file of files) {
                if (file.match("Singleton")) {
                    const filePath = path.join("./user_data/", file)
                    this.log(`Removing ${filePath}...`)
                    fs.unlinkSync(filePath)
                }
            }
        } catch (e) {
        }
    }


    async sendPost(postContent: string): Promise<void> {
        await this.page.waitForSelector(".public-DraftStyleDefault-block")
        await this.page.click("[data-testid='PostTextarea_0RichTextInputContainer']")
        await this.page.type("[data-testid='PostTextarea_0RichTextInputContainer']", postContent)

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
            this.log("Unable to send Post.")
        }).then(async () => {
            this.log("Post sent.")
        })
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
            .catch(() => this.log("Didn't find username field, already logged in?"))
    }


    async humanType(selector: string, text: string, delay: number = 100) {
        // type each character with a random delay
        for (const character of text) {
            await this.page.type(selector, character, {delay: useRandomDelay(delay, delay + 500)})
        }
    }
}
