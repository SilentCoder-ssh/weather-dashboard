const clockSpan: HTMLSpanElement = document.querySelector('#clock')! as HTMLSpanElement;

const ps = (element: any) => String(element).padStart(2, "0");

const convert = (ms: number) => {
    const [hourMs, minMs, sMs]: number[] = [36e5, 6e4, 1e3]

    const h: number = Math.floor(ms / hourMs) //3 600 000  200 000 / 
    const min: number = Math.floor(ms % hourMs / minMs)
    const s: number = Math.floor(ms % minMs / sMs)

    return `${ps(h)} : ${ps(min)} : ${ps(s)}`
}

const currentTimeMs = () => {
    const now = new Date()
    return now.getHours() * 36e5 + now.getMinutes() * 6e4 + now.getSeconds() * 1e3 + now.getMilliseconds()
}

const getTime = () => convert(currentTimeMs())

const displayClock = () => {
    const currentTime = getTime()
    clockSpan.textContent = currentTime
}

window.setInterval(() => displayClock(), 1000)

