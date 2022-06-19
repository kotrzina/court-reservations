/**
 * Converts slot index to exact time slot
 * @example:
 * 0 -> 00:00
 * 1 -> 00:30
 * 2 -> 01:00
 */
export function indexToTime(idx: number): string {
    const h = Math.floor(idx / 2)
    const m = (idx % 2) * 30

    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`
}


export function formatDate(dateString: string): string {
    const d = new Date(dateString)

    const day = d.getDate().toString()
    const month = (d.getMonth() + 1).toString()

    return `${day}. ${month}.`
}

export function slotsToDuration(slotFrom: number, slotTo: number): string {
    const d = slotTo - slotFrom + 1
    const h = Math.floor(d / 2)
    const m = (d % 2) * 30

    if (h > 0 && m > 0) {
        return `${h.toString()}h${m.toString().padStart(2, "0")}m`
    } else if (h > 0) {
        return `${h.toString()}h`
    }

    return `${m.toString().padStart(2, "0")}m`
}

const days = [
    "ne",
    "po",
    "út",
    "st",
    "čt",
    "pá",
    "so",
]

export function getDayInWeek(date: string): string {
    const d = new Date(date)
    return days[d.getDay()]
}

const fullDays = [
    'neděle',
    'pondělí',
    'úterý',
    'středa',
    'čtvrtek',
    'pátek',
    'sobota',
]

export function getFullDayInWeek(date: string): string {
    const d = new Date(date)
    return fullDays[d.getDay()]
}
