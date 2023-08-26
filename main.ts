import { app, BrowserWindow } from "electron"
import puppeteer, { Browser, Page } from "puppeteer"
import * as dotenv from "dotenv"
import * as fs from "fs"
import { tweets } from "./tweets/hereticny"
import { useMoveToClick } from "./composables/useMoveToClick"
import { getMousePosition, useMouseHelper } from "./composables/useMouseHelper"
import { getRandomWikipediaArticle } from "./composables/getWikipediaArticle"
import { generateTweet } from "./composables/openai"
import * as path from "path"

dotenv.config()

const twitterUsername: string = process.env.TWITTER_USERNAME!
const twitterPassword: string = process.env.TWITTER_PASSWORD!
const sentTweetsFile: string = "sent-tweets.txt"
const tweetsArray = Object.entries(tweets).map(([id, text]) => ( {id, text} ))
const categories = process.env.WIKIPEDIA_CATEGORIES!.split(",")
const randomArticleChance = process.env.RANDOM_ARTICLE_CHANCE ? parseFloat(process.env.RANDOM_ARTICLE_CHANCE) : 0.8

let sentTweetIDs: Set<string> = new Set(fs.existsSync(sentTweetsFile) ? fs.readFileSync(sentTweetsFile, "utf-8").split("\n") : [])
let win: BrowserWindow
let browser: Browser
let winSession: Electron.Session
let page: Page

async function deleteSingletonFiles() {
    try {
        const files = fs.readdirSync("./user_data/")
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

async function postTweet(tweet: string) {

    await page.waitForSelector(".public-DraftStyleDefault-block")
    await page.click("[data-testid='tweetTextarea_0RichTextInputContainer']")
    await page.type("[data-testid='tweetTextarea_0RichTextInputContainer']", tweet)

    await new Promise(resolve => setTimeout(resolve, 1000))

    const elementHandle = await page.$("[aria-label=\"Add post\"]")
    const nextSiblingHandle = await elementHandle?.evaluateHandle(element => element.nextElementSibling)
    await nextSiblingHandle?.asElement()?.click()

    await page.waitForSelector("[id*='typeaheadDropdownWrapped-']", {timeout: 1000})
        .then(async () => {
            await page.keyboard.press("Escape")
        }).catch(() => {
        })

    const start = getMousePosition()

    await useMoveToClick(page, nextSiblingHandle?.asElement()!, start.x, start.y).catch(() => {
        console.log("Unable to send tweet.")

    }).then(async () => {
        console.log("Tweet sent.")
    })

}

app.on("ready", initialize)

process.on("exit", async () => {
    // await saveSession()
})

process.on("SIGINT", () => {
    process.exit()
})

process.on("SIGTERM", () => {
    process.exit()
})


async function initialize() {
    await deleteSingletonFiles()

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

        page = await browser.newPage()

        page.on("dialog", async dialog => {
            console.log(dialog.message())
            await dialog.dismiss()
        })

        await useMouseHelper(page)
        await login()
        await sendTweet()
        await nextTweet()
    })


}

async function nextTweet() {
    // Delay between 5 minutes and 2 hours
    setTimeout(sendTweet, ( 1000 * 60 * 5 ) + ( Math.random() * ( 1000 * 60 * 60 ) * 5 ))
}

async function login() {


    // Set user agent and viewport to emulate real browser
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36")
    await page.setViewport({
        width: Math.floor(1366 + ( Math.random() * 100 )),
        height: Math.floor(768 + ( Math.random() * 100 ))
    })

    await page.goto("https://twitter.com/login")

    await page.waitForSelector("input[autocomplete='username']", {timeout: 5000})
        .then(async () => {
            await page.click("input[autocomplete='username']")
            await humanType("input[autocomplete='username']", twitterUsername + "\n")

            await page.waitForSelector("input[autocomplete='current-password']")
            await page.click("input[autocomplete='current-password']")
            await humanType("input[autocomplete='current-password']", twitterPassword + "\n")
            // await saveSession()

        })
        .catch(() => console.log("Didn't find username field"))


}

function getRandomDelay(min: number = 200, max: number = 900): number {
    return Math.random() * ( max - min ) + min
}

// delayed type
async function humanType(selector: string, text: string, delay: number = 100) {
    for (const character of text) {
        await page.type(selector, character, {delay: getRandomDelay(delay, delay + 30)})
    }
}


async function sendTweet() {
    if (Math.random() > 0.8) {
        const availableTweets = tweetsArray.filter(tweet => !sentTweetIDs.has(tweet.id))
        if (availableTweets.length === 0) return
        const tweetContent = availableTweets[Math.floor(Math.random() * availableTweets.length)]
        console.log(`Pulled Tweet (${tweetContent.id}): ${tweetContent.text}`)
        await postTweet(tweetContent.text)
        sentTweetIDs.add(tweetContent.id)
        fs.appendFileSync(sentTweetsFile, tweetContent.id + "\n")
    } else {
        getRandomWikipediaArticle(categories).then(async (article: any) => {
            // get tweet for article using OpenAI
            await generateTweet(article.body).then(async (tweet) => {
                if (tweet) {
                    // remove quotes from start and end of tweet
                    tweet = tweet.replace(/^"(.+(?="$))"$/, "$1")
                    console.log(`Generated Tweet: ${tweet}`)
                    await postTweet(tweet)


                } else {
                    console.log("Failed to generate a tweet.")
                }
            })
        })
    }
}

