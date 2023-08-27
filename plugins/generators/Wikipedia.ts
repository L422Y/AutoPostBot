import { getRandomWikipediaArticle } from "../../composables/useWikipedia"
import { generatePost } from "../../composables/useOpenAI"
import { BaseGeneratorPlugin } from "../../lib/BaseGeneratorPlugin"

const categories = process.env.WIKIPEDIA_CATEGORIES!.split(",")

export class Wikipedia extends BaseGeneratorPlugin {
    name = "Wikipedia"

    async generatePost(): Promise<string | void> {
        return await getRandomWikipediaArticle(categories).then(async (article: any) => {
            // get Post for article using OpenAI
            return await generatePost(article.body).then(async (Post) => {
                if (Post) {
                    // remove quotes from start and end of Post
                    Post = Post.replace(/^"(.+(?="$))"$/, "$1")
                    this.log(`Generated Post: ${Post}`)
                    return Post as string
                } else {
                    this.log("Failed to generate a Post.")
                }
            })
        })
    }
}
