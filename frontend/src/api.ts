export type Slot = {
    date: string; // date in format Y-m-d
    index: number; // slot index 0-95
    status: "free" | "taken" | "maintenance" | "history";
}

export type Day = {
    date: string,
    slots: Slot[] // always 96 slots
}

export type TimeTable = {
    timeTable: Day[]
}

export type Reservation = {
    date: string; // date in format Y-m-d
    slotFrom: number;
    slotTo: number;
    owner?: string; // name of the booking owner
}

export type AvailableReservations = {
    possibilities: Reservation[];
}

export type LoginResponse = {
    name: string;
    username: string;
    jwt: string;
}


export async function fetchTimeTable(): Promise<TimeTable> {
    const res = await fetch("http://localhost:8081/api/time-table")

    if (res.status !== 200) {
        throw Error("could not fetch data from API")
    }

    return await res.json()
}

export async function fetchAvailable(date: string, firstSlot: number): Promise<AvailableReservations> {
    const res = await fetch(`http://localhost:8081/api/available/${date}/${firstSlot}`)

    if (res.status !== 200) {
        throw Error("could not fetch data from API")
    }

    return await res.json()
}

export async function postReservation(date: string, slotFrom: number, slotTo: number): Promise<void> {
    const res = await fetch(`http://localhost:8081/api/reservation`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            date: date,
            slotFrom: slotFrom,
            slotTo: slotTo,
        })
    })

    if (res.status !== 200) {
        throw Error("could not create reservation")
    }
}

export async function postLogin(username: string, password: string): Promise<LoginResponse> {
    const res = await fetch(`http://localhost:8081/api/user/login`, {
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

export async function postRegister(username: string, password: string, name: string): Promise<void> {
    const res = await fetch(`http://localhost:8081/api/user/register`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: name,
            username: username,
            password: password,
        })
    })

    if (res.status !== 200) {
        throw Error("could not register user")
    }
}
