import {getUserFromStorage} from "./user";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL as string

export type Slot = {
    date: string; // date in format Y-m-d
    index: number; // slot index 0-47
    status: "free" | "taken" | "maintenance" | "history";
    owner?: string;
    note?: string;
}

export type Day = {
    date: string,
    slots: Slot[]; // always 96 slots
}

export type TimeTable = {
    timeTable: Day[];
    reservations: Reservation[];
    todayReservations: Reservation[];
    userReservations: Reservation[];
}

export type Reservation = {
    date: string; // date in format Y-m-d
    slotFrom: number;
    slotTo: number;
    name?: string;
    username?: string;
    note?: string;
    isActive: boolean;
}

export type LoginResponse = {
    name: string;
    username: string;
    isAdmin: boolean;
    jwt: string;
}

export type UserListItem = {
    username: string;
    name: string;
    city: string;
}

export async function fetchTimeTable(): Promise<TimeTable> {
    const user = getUserFromStorage()
    let res: Response
    if (user.logged) {
        res = await fetch(`${BACKEND_URL}/api/private/v1/time-table`, {
            headers: {
                "Authorization": `Bearer ${user.jwt}`
            }
        })
    } else {
        res = await fetch(`${BACKEND_URL}/api/public/v1/time-table`)
    }

    if (res.status !== 200) {
        throw Error("could not fetch data from API")
    }

    return await res.json()
}

export async function fetchAvailable(date: string, firstSlot: number): Promise<Reservation[]> {
    const user = getUserFromStorage()
    const res = await fetch(`${BACKEND_URL}/api/private/v1/available/${date}/${firstSlot}`, {
        headers: {
            "Authorization": `Bearer ${user.jwt}`
        }
    })

    if (res.status !== 200) {
        throw Error("could not fetch data from API")
    }

    return await res.json()
}

export async function postReservation(date: string, slotFrom: number, slotTo: number, isPublic: boolean, note: string): Promise<void> {
    const user = getUserFromStorage()
    const res = await fetch(`${BACKEND_URL}/api/private/v1/reservation`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.jwt}`
        },
        body: JSON.stringify({
            date: date,
            slotFrom: slotFrom,
            slotTo: slotTo,
            isPublic: isPublic,
            note: note,
        })
    })

    if (res.status !== 200) {
        throw Error("could not create reservation")
    }
}

export async function postLogin(username: string, password: string): Promise<LoginResponse> {
    const res = await fetch(`${BACKEND_URL}/api/public/v1/user/login`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username,
            password: password,
        })
    })

    if (res.status !== 200) {
        throw Error("could not fetch data from API")
    }

    return await res.json()
}

export async function postRegister(username: string, password: string, name: string, city: string, code: string): Promise<boolean> {
    const res = await fetch(`${BACKEND_URL}/api/public/v1/user/register`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: name,
            username: username,
            password: password,
            city: city,
            code: code,
        })
    })

    if (res.status !== 200) {
        throw Error("could not register user")
    }

    return true
}

export async function fetchAllReservations(): Promise<Reservation[]> {
    const user = getUserFromStorage()
    const res = await fetch(`${BACKEND_URL}/api/private/v1/admin/reservation`, {
        headers: {
            "Authorization": `Bearer ${user.jwt}`,
            "Accept": "application/json",
        }
    })

    if (res.status !== 200) {
        throw Error("could not fetch data from API")
    }

    return await res.json()
}

export async function deleteReservation(date: string, slotFrom: number): Promise<Reservation[]> {
    const user = getUserFromStorage()
    const res = await fetch(`${BACKEND_URL}/api/private/v1/reservation/${date}/${slotFrom}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${user.jwt}`,
            "Accept": "application/json",
        }
    })

    if (res.status !== 200) {
        throw Error("could not fetch data from API")
    }

    return await res.json()
}

export async function fetchUsers(): Promise<UserListItem[]> {
    const user = getUserFromStorage()
    const res = await fetch(`${BACKEND_URL}/api/private/v1/admin/user`, {
        headers: {
            "Authorization": `Bearer ${user.jwt}`,
            "Accept": "application/json",
        }
    })

    if (res.status !== 200) {
        throw Error("could not fetch data from API")
    }

    return await res.json()
}

export async function deleteUser(username: string): Promise<boolean> {
    const user = getUserFromStorage()
    const res = await fetch(`${BACKEND_URL}/api/private/v1/admin/user/${username}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${user.jwt}`,
            "Accept": "application/json",
        }
    })

    if (res.status !== 200) {
        throw Error("could not delete user")
    }

    return true
}

export async function postAlertNotification(title, message: string): Promise<void> {
    const user = getUserFromStorage()
    const res = await fetch(`${BACKEND_URL}/api/private/v1/alert-notification`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${user.jwt}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title: title,
            message: message,
        })
    })

    if (res.status !== 200) {
        throw Error("could not send alert notification")
    }
}
