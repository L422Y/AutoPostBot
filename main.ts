import { app, BrowserWindow } from "electron"
import puppeteer, { Browser, Page } from "puppeteer"
import * as dotenv from "dotenv"
import * as fs from "fs"
import { tweets } from "./tweets/hereticny"
import { useMoveToClick } from "./composables/useMoveToClick"
import { getMousePosition, useMouseHelper } from "./composables/useMouseHelper"

dotenv.config()

const twitterUsername: string = process.env.TWITTER_USERNAME!
const twitterPassword: string = process.env.TWITTER_PASSWORD!
const sentTweetsFile: string = "sent-tweets.txt"
const tweetsArray = Object.entries(tweets).map(([id, text]) => ( {id, text} ))

let sentTweetIDs: Set<string> = new Set(fs.existsSync(sentTweetsFile) ? fs.readFileSync(sentTweetsFile, "utf-8").split("\n") : [])
let win: BrowserWindow
let browser: Browser
let winSession: Electron.Session
let page: Page

async function postTweet(tweet: { id: string, text: string }) {

    await page.waitForSelector(".public-DraftStyleDefault-block")
    await page.click("[data-testid='tweetTextarea_0RichTextInputContainer']")
    await page.type("[data-testid='tweetTextarea_0RichTextInputContainer']", tweet.text)

    await new Promise(resolve => setTimeout(resolve, 1000))

    const elementHandle = await page.$("[aria-label=\"Add post\"]")
    const nextSiblingHandle = await elementHandle?.evaluateHandle(element => element.nextElementSibling)
    await nextSiblingHandle?.asElement()?.click()

    await page.waitForSelector("[id*='typeaheadDropdownWrapped-']", {timeout: 1000}).then(async () => {
        await page.keyboard.press("Escape")
    }).catch(() => {
    })

    const start = getMousePosition()

    await useMoveToClick(page, nextSiblingHandle?.asElement()!, start.x, start.y)

    sentTweetIDs.add(tweet.id)
    fs.appendFileSync(sentTweetsFile, tweet.id + "\n")
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
    // win = new BrowserWindow({
    //     width: 800 + Math.random() * 200,
    //     height: 600 + Math.random() * 200,
    //     webPreferences: {
    //         nodeIntegration: true
    //     }
    // })

    browser = await puppeteer.launch({
        headless: false,
        userDataDir: "./user_data"
    })

    page = await browser.newPage()
    await useMouseHelper(page)
    await login()
    await sendTweet()
    setInterval(async () => sendTweet, ( Math.random() * 60 + 60 ) * 60 * 1000) // Randomly between 1 and 2 hours
}

// //
// // async function saveSession() {
// //     try {
// //         const cookies = await page.cookies()
// //         fs.writeFileSync("cookies.json", JSON.stringify(cookies))
// //     } catch (error) {
// //         console.error("Failed to save cookies", error)
// //     }
// // }
//
//
// async function loadSession() {
//     try {
//         const cookiesStr = fs.readFileSync("cookies.json", "utf8")
//         const cookies = JSON.parse(cookiesStr)
//         await Promise.all(
//             cookies.map(async (cookie: any) => {
//                 await page.setCookie(cookie)
//             })
//         )
//         console.log("Loaded cookies:", await page.cookies("https://twitter.com"))
//     } catch (error) {
//         console.error("Failed to load cookies", error)
//         // Handle error as needed
//     }
// }

// async function saveCookies() {
//     try {
//         winSession = win.webContents.session
//         const cookies = await winSession.cookies.get({})
//         fs.writeFileSync("cookies.json", JSON.stringify(cookies))
//     } catch (error) {
//         console.error("Failed to save cookies", error)
//     }
// }
// async function loadCookies() {
//     const cookies = JSON.parse(fs.readFileSync("cookies.json", "utf8"))
//     winSession = win.webContents.session
//     for (const cookie of cookies) {
//         await winSession.cookies.set(cookie)
//     }
// }

// async function saveCookies() {
//
// }


async function login() {


    // Set user agent and viewport to emulate real browser
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36")
    await page.setViewport({width: Math.floor(1366 + ( Math.random() * 100 )), height: Math.floor(768 + ( Math.random() * 100 ))})

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
    const availableTweets = tweetsArray.filter(tweet => !sentTweetIDs.has(tweet.id))
    if (availableTweets.length === 0) return
    const tweetContent = availableTweets[Math.floor(Math.random() * availableTweets.length)]
    await postTweet(tweetContent)
}

