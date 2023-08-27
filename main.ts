import { AutoPostBot } from "./lib/AutoPostBot"
import { app } from "electron"

process.on("SIGINT", () => {
    process.exit()
})
process.on("SIGTERM", () => {
    process.exit()
})

const bot = new AutoPostBot()
if (app) {
    app.on("ready", bot.initialize.bind(bot))
} else {
    bot.initialize.bind(bot)()
}
