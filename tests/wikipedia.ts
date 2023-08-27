import * as dotenv from "dotenv"
import { getRandomWikipediaArticle } from "@/composables/useWikipedia"
import { generateImage, generatePost } from "@/composables/useOpenAI"

dotenv.config()

const categories = process.env.WIKIPEDIA_CATEGORIES!.split(",")
const article = getRandomWikipediaArticle(categories).then(async (article: any) => {
    //get Post for article using OpenAI
    await generatePost(article.body).then((Post) => {
        if (Post) {
            console.log(`Generated Post: ${Post}`)
            console.log(`Generated Post Length: ${Post.length}`)
            // generate image for Post using OpenAI
            // generateImage(Post).then((image) => {
            //     if (image) {
            //         console.log(JSON.stringify(image, null, 2))
            //         console.log(`Generated Image: ${image}`)
            //     } else {
            //         console.log("Failed to generate an image.")
            //     }
            // })
        } else {
            console.log("Failed to generate a Post.")
        }
    })
})
