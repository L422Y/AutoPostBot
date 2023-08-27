import { TwitterPostBot } from "@/lib/TwitterPostBot"
import { app } from "electron"

process.on("SIGINT", () => {
    process.exit()
})
process.on("SIGTERM", () => {
    process.exit()
})

const bot = new TwitterPostBot()
app.on("ready", bot.initialize)
