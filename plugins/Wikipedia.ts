import { getRandomWikipediaArticle } from "@/composables/useWikipedia"
import { generateTweet } from "@/composables/useOpenAI"
import { BaseTweetPlugin } from "../lib/BaseTweetPlugin"

const categories = process.env.WIKIPEDIA_CATEGORIES!.split(",")

export class WikipediaPlugin extends BaseTweetPlugin {
    async generateTweet(): Promise<string | void> {
        return await getRandomWikipediaArticle(categories).then(async (article: any) => {
            // get tweet for article using OpenAI
            await generateTweet(article.body).then(async (tweet) => {
                if (tweet) {
                    // remove quotes from start and end of tweet
                    tweet = tweet.replace(/^"(.+(?="$))"$/, "$1")
                    console.log(`Generated Tweet: ${tweet}`)
                    return tweet as string
                } else {
                    console.log("Failed to generate a tweet.")
                }
            })
        })
    }
}
