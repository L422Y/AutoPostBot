import { generateTweet } from "@/composables/useOpenAI"

generateTweet("technology").then((tweet) => {
  console.log(tweet)
  console.log("Length:", tweet.length)
})
