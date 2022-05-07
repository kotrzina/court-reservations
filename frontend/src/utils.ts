import React from "react";

/**
 * Converts slot index to exact time slot
 * @example:
 * 0 -> 00:00
 * 1 -> 00:15
 * 2 -> 00:30
 * 5 -> 01:15
 */
export function indexToTime(idx: number): string {
    const h = Math.floor(idx / 4)
    const m = (idx % 4) * 15

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
    const h = Math.floor(d / 4)
    const m = (d % 4) * 15

    if (h > 0) {
        return `${h.toString()}h ${m.toString().padStart(2, "0")}m`
    }

    return `${m.toString().padStart(2, "0")}m`
}
