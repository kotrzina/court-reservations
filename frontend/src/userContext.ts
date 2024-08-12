import {createContext} from "react";
import {emptyUser, User} from "./user";

export type UserContextData = {
    user: User
    login(_user: User): void
}

export const UserContext = createContext<UserContextData>({
    user: emptyUser,
    login(_user: User): void {
    },
})
