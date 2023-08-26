import { generateTweet } from "../composables/openai"

generateTweet("technology").then((tweet) => {
  console.log(tweet)
  console.log("Length:", tweet.length)
})
