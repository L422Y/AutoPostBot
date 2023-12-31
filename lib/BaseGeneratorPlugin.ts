import { IGeneratorPlugin } from "@/types/IGeneratorPlugin"

export class BaseGeneratorPlugin implements IGeneratorPlugin {
    chance: number = 0.5
    name: string = "BaseGeneratorPlugin"

    constructor(options?: any) {
        if (options?.chance) {
            this.chance = options.chance
        }
    }

    ready():void {
        this.log(`Ready... ${this.chance * 100}% chance`)
    }

    async generatePost(): Promise<string | void> {
        return Promise.resolve(undefined)
    }

    async confirmPostSent(): Promise<void> {
        return Promise.resolve(undefined)
    }

    log(...args: any[]): void {
        console.log(`👷 ${this.name} >`, ...args)
    }
}
