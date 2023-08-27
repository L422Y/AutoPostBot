import axios from "axios"
import { configDotenv } from "dotenv"

configDotenv()

let OPENAI_INITIAL_PROMPT = process.env.OPENAI_INITIAL_PROMPT

if (OPENAI_INITIAL_PROMPT === undefined || OPENAI_INITIAL_PROMPT === null || OPENAI_INITIAL_PROMPT === "") {
    OPENAI_INITIAL_PROMPT = `Generate a 200 character Post like one of these:
    
    "New electronic waste from discarded gadgets makes up for 70% of all toxic waste. Let's consider recycling and upcycling our tech to create a healthier environment for us all."
    "In the realm of technology, the first alarm clock could only ring at 4am! Created by Levi Hutchins in 1787, its sole purpose was to wake him for his pre-dawn job. Truly an early bird that transformed the way we start our days."
    "The first computer mouse was made of wood! Created by Douglas Engelbart in 1964, it was a simple wooden shell with two metal wheels. It was later patented in 1970."
    
    Do not make it a question, avoid using or featuring gender or politics, do not use phrases like "Did you know". The simple Post should include a single interesting fact about the following:`
}
const apiKey = process.env.OPENAI_KEY

const headers = {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json",
}

export const generatePost = async (content: string) => {

    if (apiKey === undefined || apiKey === null || apiKey === "") {
        console.error("OpenAI API Key not found. Please add OPENAI_KEY to your .env to use this plugin.")
        return null
    }

    const model = "gpt-4"
    const endpoint = `https://api.openai.com/v1/chat/completions`

    let prompt = `${OPENAI_INITIAL_PROMPT}\n\n${content}`

    prompt = prompt.substring(0, 1024)


    try {
        let response: any
        let content: string

        response = await axios.post(endpoint, {
            model,
            temperature: 0.2,
            max_tokens: 200,
            top_p: 0.1,
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


        content = response.data.choices[0].message.content
        if (content.length > 280) {
            console.log('Shortening...')
            response = await axios.post(endpoint, {
                model,
                messages: [{
                    "role": "user",
                    "content": `Condense this Post: ${content}`
                }]
            }, {
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
            })

            content = response.data.choices[0].message.content
        }

        return content

    } catch
        (error) {
        console.error(`Error generating Post: ${error}`)
        if (error.response) {
            console.log(error.response.data)
            console.log(error.response.status)
            console.log(error.response.headers)
        }
        return null
    }
}

export const generateImage = async (prompt: string) => {
    // const endpoint = `https://api.openai.com/v1/images/generations`
    //
    // try {
    //     const response = await axios.post(endpoint, {
    //         prompt,
    //         n: 1,
    //         size: "1024x1024"
    //     }, {
    //         headers,
    //     })
    //
    //     const data = response.data
    //     console.log(JSON.stringify(data, null, 2))
    //
    //     const image = data.images[0]
    //     // save image to file
    //     // const imageBuffer = Buffer.from(image, "base64")
    //     // fs.writeFileSync("image.png", imageBuffer)
    //     console.log("Generated image:", image.data.url)
    //     return image
    //
    //
    // } catch (error) {
    //     console.error(`Error generating image: ${error}`)
    //     if (error.response) {
    //         console.log(error.response.data)
    //         console.log(error.response.status)
    //         console.log(error.response.headers)
    //     }
    //     return null
    // }
}
