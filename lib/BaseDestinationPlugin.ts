import { IDestinationPlugin } from "../types/IDestinationPlugin"

export class BaseDestinationPlugin implements IDestinationPlugin {
    name: string = "BaseDestinationPlugin"

    constructor(options?: any) {
        this.log(`...Initialized`)
    }

    async initialize(): Promise<void> {
        return Promise.resolve(undefined)
    }

    async sendPost(postContent: string): Promise<void> {
        return Promise.resolve(undefined)
    }

    async confirmPostSent(): Promise<void> {
        return Promise.resolve(undefined)
    }

    log(...args: any[]): void {
        console.log(`[${this.name}]`, ...args)
    }

}
