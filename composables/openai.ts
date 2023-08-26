import axios from "axios"
import * as dotenv from "dotenv"

dotenv.config()

export const generateTweet = async (content: string) => {
    const model = "gpt-3.5-turbo"
    const endpoint = `https://api.openai.com/v1/chat/completions`
    const apiKey = process.env.OPENAI_KEY
    const prompt = `Generate copy for a tweet (without a question) that includes an interesting fact about the following:\n\n${content}`

    try {
        const response = await axios.post(endpoint, {
            max_tokens: 280,
            model,
            temperature: 0.7,
            messages: [{
                "role": "user",
                "content": prompt
            }]
        }, {
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
        })

        // Extract and return the generated tweet
        return response.data.choices[0].content.trim()
    } catch (error) {
        console.error(`Error generating tweet: ${error}`)
        if (error.response) {
            console.log(error.response.data)
            console.log(error.response.status)
            console.log(error.response.headers)
        }
        return null
    }
}

// Example usage
// generateTweet("technology")
//     .then((tweet) => {
//         if (tweet) {
//             console.log(JSON.stringify(tweet, null, 2))
//             console.log(`Generated Tweet: ${tweet}`)
//         } else {
//             console.log("Failed to generate a tweet.")
//         }
//     })
//     .catch((error) => {
//         console.error(`Error generating tweet: ${error}`)
//
//     })
