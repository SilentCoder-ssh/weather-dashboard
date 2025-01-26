export function updateElement (element: HTMLElement, value: string): void {
    if(value !== undefined &&  value !== null) {
        element.textContent = value
    }
}