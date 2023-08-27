import { generatePost } from "@/composables/useOpenAI"

generatePost("technology").then((Post) => {
  console.log(Post)
  console.log("Length:", Post.length)
})
