import { IDestinationPlugin } from "@/types/IDestinationPlugin"

export class BaseDestinationPlugin implements IDestinationPlugin {
    name: string = "BaseDestinationPlugin"

    constructor(options?: any) {

    }

    async initialize(): Promise<void> {
        return Promise.resolve(undefined)
    }

    ready():void {
        this.log(`Ready...`)
    }

    async sendPost(postContent: string): Promise<void> {
        return Promise.resolve(undefined)
    }

    async confirmPostSent(): Promise<void> {
        return Promise.resolve(undefined)
    }

    log(...args: any[]): void {
        console.log(`📡 ${this.name} >`, ...args)
    }

}
