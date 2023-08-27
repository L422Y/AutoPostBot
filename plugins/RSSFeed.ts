import { BaseTweetPlugin } from "../lib/BaseTweetPlugin"
import * as fs from "fs"
import * as RSSParser from "rss-parser"


export class RSSFeed extends BaseTweetPlugin {
    name = "RSSFeed"
    parser: RSSParser = new RSSParser()
    sentPostsFile: string = "sent-posts.txt"
    sentPostIds: Set<string>
    lastTweet: { title: string, link: string, guid: string }
    feedURL: string = process.env.RSS_FEED_URL!
    feedPosts: any[]

    constructor() {
        super()
        this.sentPostIds = new Set(fs.existsSync(this.sentPostsFile) ? fs.readFileSync(this.sentPostsFile, "utf-8").split("\n") : [])
        this.generateTweet = this.generateTweet.bind(this)
        this.refreshPosts = this.refreshPosts.bind(this)
    }

    async generateTweet(): Promise<string | void> {
        await this.refreshPosts()
        const availablePosts = this.feedPosts.filter(post => !this.sentPostIds.has(post.guid))
        if (availablePosts.length === 0) {
            this.log("No unsent posts available")
            return
        }
        const postContent = availablePosts[Math.floor(Math.random() * availablePosts.length)]
        this.log(`Pulled Post (${postContent.guid}): ${postContent.title}`)
        this.lastTweet = postContent
        return `${postContent.title}\n${postContent.link}`
    }

    async confirmTweetSent() {
        if (!this.lastTweet) return
        this.sentPostIds.add(this.lastTweet.guid)
        // write sent tweet to file
        fs.appendFileSync(this.sentPostsFile, this.lastTweet.guid + "\n")
        this.lastTweet = undefined
    }

    async refreshPosts() {
        this.log("Refreshing posts")
        const feed: any = await this.parser.parseURL(this.feedURL).catch((err) => {
            this.log(err)
        })

        this.feedPosts = feed.items
    }
}
