import { BaseGeneratorPlugin } from "@/lib/BaseGeneratorPlugin"
import * as fs from "fs"
import Parser from "rss-parser"

export class RSSFeed extends BaseGeneratorPlugin {
    name = "RSSFeed"
    parser: Parser = new Parser()
    sentPostsFile: string = "sent-posts.txt"
    sentPostIds: Set<string>
    lastPost: { title: string, link: string, guid: string }
    feedURL: string = process.env.RSS_FEED_URL!
    feedPosts: any[]

    constructor() {
        super()
        this.sentPostIds = new Set(fs.existsSync(this.sentPostsFile) ? fs.readFileSync(this.sentPostsFile, "utf-8").split("\n") : [])
        this.generatePost = this.generatePost.bind(this)
        this.refreshPosts = this.refreshPosts.bind(this)
        this.ready()

    }

    async generatePost(): Promise<string | void> {
        await this.refreshPosts()
        const availablePosts = this.feedPosts.filter(post => !this.sentPostIds.has(post.guid))
        if (availablePosts.length === 0) {
            this.log("No unsent posts available")
            return
        }
        const postContent = availablePosts[Math.floor(Math.random() * availablePosts.length)]
        this.log(`Pulled Post (${postContent.guid}): ${postContent.title}`)
        this.lastPost = postContent
        return `${postContent.title}\n${postContent.link}`
    }

    async confirmPostSent() {
        if (!this.lastPost) return
        this.sentPostIds.add(this.lastPost.guid)
        // write sent Post to file
        fs.appendFileSync(this.sentPostsFile, this.lastPost.guid + "\n")
        this.lastPost = undefined
    }

    async refreshPosts() {
        this.log("Refreshing posts")
        const feed: any = await this.parser.parseURL(this.feedURL).catch((err) => {
            this.log(err)
        })

        this.feedPosts = feed.items
    }
}
