export interface IDestinationPlugin {
    name: string
    initialize(): Promise<void>
    sendPost(postContent: string): Promise<void>
    log(...args: any[]): void
}
