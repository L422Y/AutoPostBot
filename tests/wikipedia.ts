import * as dotenv from "dotenv"
import { getRandomWikipediaArticle } from "../composables/getWikipediaArticle"
import { generateImage, generateTweet } from "../composables/openai"

dotenv.config()

const categories = process.env.WIKIPEDIA_CATEGORIES!.split(",")
const article = getRandomWikipediaArticle(categories).then(async (article: any) => {
    //get tweet for article using OpenAI
    await generateTweet(article.body).then((tweet) => {
        if (tweet) {
            console.log(`Generated Tweet: ${tweet}`)
            console.log(`Generated Tweet Length: ${tweet.length}`)
            // generate image for tweet using OpenAI
            // generateImage(tweet).then((image) => {
            //     if (image) {
            //         console.log(JSON.stringify(image, null, 2))
            //         console.log(`Generated Image: ${image}`)
            //     } else {
            //         console.log("Failed to generate an image.")
            //     }
            // })
        } else {
            console.log("Failed to generate a tweet.")
        }
    })
})
