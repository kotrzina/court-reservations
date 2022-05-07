export type User = {
    logged: boolean;
    name: string;
    username: string;
    isAdmin: boolean;
    jwt: string;
}

export const emptyUser: User = {
    logged: false,
    name: "",
    username: "",
    isAdmin: false,
    jwt: "",
}

const storageKey = "user"

export function getUserFromStorage(): User {
    if (typeof window !== 'undefined') {
        const data = window.localStorage.getItem(storageKey)

        if (data && data.length > 0) {
            try {
                return JSON.parse(data)
            } catch (e) {
                // not valid json - create new one
            }
        }
    }

    const u: User = {
        logged: false,
        name: "",
        username: "",
        isAdmin: false,
        jwt: "",
    }

    setUserToStorage(u)
    return u
}

export function setUserToStorage(user: User): void {
    if (typeof window !== 'undefined') {
        window.localStorage.setItem(storageKey, JSON.stringify(user))
    }
}
