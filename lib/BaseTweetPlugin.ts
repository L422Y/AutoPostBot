export class BaseTweetPlugin {
    chance: number = 0.5
    name: string = "BaseTweetPlugin"

    constructor(options?: any) {
        if (options?.chance) {
            this.chance = options.chance
        }
    }

    async generateTweet(): Promise<string | void> {
        return Promise.resolve(undefined)
    }

    async confirmTweetSent() {
        return Promise.resolve(undefined)
    }

    log(...args: any[]) {
        console.log(`[${this.name}]`, ...args)
    }
}
