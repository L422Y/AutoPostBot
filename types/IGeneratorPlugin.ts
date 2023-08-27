export interface IGeneratorPlugin {
    chance: number
    name: string


    generatePost(): Promise<string | void>

    confirmPostSent(): Promise<void>

    log(...args: any[]): void
}
