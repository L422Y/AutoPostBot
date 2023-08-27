import { BaseGeneratorPlugin } from "../../lib/BaseGeneratorPlugin"
import * as fs from "fs"
import * as path from "path"

export class FileBased extends BaseGeneratorPlugin {
    name = "FileBased"
    sentPostsFile: string
    Posts: { [key: string]: string } = {}
    PostsArray: { id: string, text: string }[]
    sentPostIDs: Set<string>
    lastPost: { id: string, text: string }

    constructor() {
        super()
        this.generatePost = this.generatePost.bind(this)
        this.loadPosts = this.loadPosts.bind(this)

        this.loadPosts()
    }

    async generatePost(): Promise<string | void> {
        const availablePosts = this.PostsArray.filter(Post => !this.sentPostIDs.has(Post.id))
        if (availablePosts.length === 0) return
        const PostContent = availablePosts[Math.floor(Math.random() * availablePosts.length)]
        this.log(`Pulled post (${PostContent.id}): ${PostContent.text}`)
        this.lastPost = PostContent
        return PostContent.text
    }

    async confirmPostSent() {
        if (!this.lastPost) return
        this.sentPostIDs.add(this.lastPost.id)
        // write sent Post to file
        fs.appendFileSync(this.sentPostsFile, this.lastPost.id + "\n")
        this.lastPost = undefined
    }

    loadPosts() {
        // load all Posts from Posts folder
        const postsPath = path.resolve(__dirname, "../../../posts/")
        const PostFiles = fs.readdirSync(postsPath, "utf-8")
        for (const PostFile of PostFiles) {
            if (!PostFile.match(/\.json$/)) continue
            const PostFileData = fs.readFileSync(path.join(postsPath, PostFile), "utf-8")
            const PostFileJSON = JSON.parse(PostFileData)

            Object.entries(PostFileJSON).forEach(([id, text]) => {
                const key = `${PostFile.replace(/\.json$/, "")}-${id}`
                this.Posts[key] = text as string
            })

            this.sentPostsFile = "sent-posts.txt"
            this.PostsArray = Object.entries(this.Posts).map(([id, text]) => ( {id, text} ))
        }

        this.log(`Loaded ${this.PostsArray.length} posts from ${PostFiles.length} files.`)

        this.sentPostIDs = new Set(fs.existsSync(this.sentPostsFile) ? fs.readFileSync(this.sentPostsFile, "utf-8").split("\n") : [])

    }

}
