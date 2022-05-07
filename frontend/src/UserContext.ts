import {createContext} from "react";
import {emptyUser, User} from "./user";

export type UserContextData = {
    user: User
    login(user: User): void
}

export const UserContext = createContext<UserContextData>({
    user: emptyUser,
    login(user: User): void {
    },
})
