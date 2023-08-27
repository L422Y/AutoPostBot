export class BaseTweetPlugin {
    chance: number = 0.5

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

}
