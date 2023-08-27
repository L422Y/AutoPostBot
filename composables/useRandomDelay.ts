export function useRandomDelay(min: number = 200, max: number = 900): number {
    return Math.random() * ( max - min ) + min
}
