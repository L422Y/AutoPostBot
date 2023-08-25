import { ElementHandle, Page } from "puppeteer"


export async function useMoveToClick(page: Page, element: ElementHandle, startX: number, startY: number) {


    const boundingBox = await element.boundingBox();

    if (boundingBox) {
        const endX = boundingBox.x + boundingBox.width / 2;
        const endY = boundingBox.y + boundingBox.height / 2;

        const steps = 500;
        const delay = 5;

        for (let i = 0; i < steps; i++) {
            const x = startX + (endX - startX) * (i / steps);
            const y = startY + (endY - startY) * (i / steps);
            await page.mouse.move(x + getRandom(-2, 2), y + getRandom(-2, 2));
            await new Promise(resolve => setTimeout(resolve, delay))
        }

        await page.mouse.click(endX, endY);
    }
}

function getRandom(min: number, max: number) {
    return Math.random() * ( max - min ) + min
}
