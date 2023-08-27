import * as dotenv from "dotenv"

import { BaseGeneratorPlugin } from "../lib/BaseGeneratorPlugin"
import { BaseDestinationPlugin } from "../lib/BaseDestinationPlugin"

dotenv.config()

export class AutoPostBot {

    randomArticleChance: number
    postMaxDelayInHours: number = 5
    postMinDelayInHours: number = 0.5

    private enabledGeneratorPlugins: string[] = []
    private generatorPlugins: BaseGeneratorPlugin[] = []

    private enabledDestinationPlugins: string[] = []
    private destinationPlugins: BaseDestinationPlugin[] = []

    constructor() {
        this.postMaxDelayInHours = process.env.POST_MAX_DELAY_HOURS ? parseFloat(process.env.POST_MAX_DELAY_HOURS) : 0.5
        this.postMinDelayInHours = process.env.POST_MIN_DELAY_HOURS ? parseFloat(process.env.POST_MIN_DELAY_HOURS) : 0.5

        this.initialize = this.initialize.bind(this)
        this.sendPost = this.sendPost.bind(this)
        this.nextPost = this.nextPost.bind(this)

    }

    async sendPostToDestinations(Post: string) {
        for (const destination of this.destinationPlugins) {
            await destination.sendPost(Post)
        }
    }

    async initialize() {
        await this.loadPlugins()
        if (!this.generatorPlugins.length) {
            this.log("No generator plugins enabled. Exiting...")
            await new Promise(resolve => setTimeout(resolve, 5000))
            process.exit(1)
        }
        if (!this.destinationPlugins.length) {
            this.log("No destination plugins enabled. Exiting...")
            await new Promise(resolve => setTimeout(resolve, 5000))
            process.exit(1)
        }
        this.log("Starting...")
        await this.sendPost()
    }

    async loadPlugins() {
        this.log("Loading plugins...")
        const generators = process.env.ENABLED_GENERATORS!.split(",")
        for (const generator of generators) {
            const [plugin, chance] = generator.split(":")
            const pluginClass = await import(`../dist/plugins/generators/${plugin}.js`)
                .then(m => {
                    this.log(`...Loaded generator: ${plugin}`)
                    return m[plugin]
                }).catch((err) => {
                    this.log(`Failed to load plugin: ${plugin}`)
                    this.log(err)
                    return undefined
                })
            const pluginInstance = new pluginClass({chance: parseFloat(chance)})
            this.enabledGeneratorPlugins.push(plugin)
            this.generatorPlugins.push(pluginInstance)
        }

        const destinations = process.env.ENABLED_DESTINATIONS!.split(",")
        for (const destination of destinations) {
            const pluginClass = await import(`../dist/plugins/destinations/${destination}.js`)
                .then(m => {
                    this.log(`...Loaded destination: ${destination}`)
                    return m[destination]
                }).catch((err) => {
                    this.log(`Failed to load plugin: ${destination}`)
                    this.log(err)
                    return undefined
                })
            const pluginInstance = new pluginClass()
            this.enabledDestinationPlugins.push(destination)
            this.destinationPlugins.push(pluginInstance)
        }

    }

    nextPost() {
        setTimeout(this.sendPost, ( 1000 * 60 * 60 * this.postMinDelayInHours ) + ( Math.random() * ( 1000 * 60 * 60 ) * this.postMaxDelayInHours ))
    }

    async sendPost() {
        let plugin: BaseGeneratorPlugin | undefined

        // pick random plugin based on plugin chance
        while (!plugin) {
            plugin = this.generatorPlugins[Math.floor(Math.random() * this.generatorPlugins.length)]
            if (Math.random() > plugin.chance) {
                plugin = undefined
            }
        }

        this.log(`Rolled generator plugin: ${plugin.constructor.name}`)

        const postContent = await plugin.generatePost()
        if (!postContent) {
            this.log("No Post generated.")
        } else {
            this.log(`Generated Post: ${postContent}`)
            await this.sendPostToDestinations(postContent)
            await plugin.confirmPostSent()
        }
        this.nextPost()
    }

    log(...args: any[]) {
        console.log(`🤖`, ...args)
    }
}

