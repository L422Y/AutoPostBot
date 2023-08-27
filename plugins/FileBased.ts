import { BaseTweetPlugin } from "../lib/BaseTweetPlugin"
import * as fs from "fs"
import * as path from "path"

const categories = process.env.WIKIPEDIA_CATEGORIES!.split(",")

export class FileBased extends BaseTweetPlugin {
    sentTweetsFile: string
    tweets: { [key: string]: string } = {}
    tweetsArray: { id: string, text: string }[]
    sentTweetIDs: Set<string>
    lastTweet: { id: string, text: string }

    constructor() {
        super()
        this.generateTweet = this.generateTweet.bind(this)
        this.loadTweets = this.loadTweets.bind(this)

        this.loadTweets()
    }

    async generateTweet(): Promise<string | void> {
        const availableTweets = this.tweetsArray.filter(tweet => !this.sentTweetIDs.has(tweet.id))
        if (availableTweets.length === 0) return
        const tweetContent = availableTweets[Math.floor(Math.random() * availableTweets.length)]
        console.log(`Pulled Tweet (${tweetContent.id}): ${tweetContent.text}`)
        this.lastTweet = tweetContent
        return tweetContent.text
    }

    async confirmTweetSent() {
        if (!this.lastTweet) return
        this.sentTweetIDs.add(this.lastTweet.id)
        // write sent tweet to file
        fs.appendFileSync(this.sentTweetsFile, this.lastTweet.id + "\n")
        this.lastTweet = undefined
    }

    loadTweets() {
        // load all tweets from tweets folder
        const tweetFiles = fs.readdirSync("./tweets/", "utf-8")
        for (const tweetFile of tweetFiles) {
            if (!tweetFile.match(/\.json$/)) continue
            const tweetFileData = fs.readFileSync(path.join("./tweets/", tweetFile), "utf-8")
            const tweetFileJSON = JSON.parse(tweetFileData)

            Object.entries(tweetFileJSON).forEach(([id, text]) => {
                const key = `${tweetFile.replace(/\.json$/, "")}-${id}`
                this.tweets[key] = text as string
            })

            this.sentTweetsFile = "sent-tweets.txt"
            this.tweetsArray = Object.entries(this.tweets).map(([id, text]) => ( {id, text} ))

        }

        this.sentTweetIDs = new Set(fs.existsSync(this.sentTweetsFile) ? fs.readFileSync(this.sentTweetsFile, "utf-8").split("\n") : [])

    }

}
