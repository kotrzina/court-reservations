import {FC} from "react";
import {User} from "../src/user";
import {Navbar} from "react-bootstrap";

type Props = {
    user: User
};
export const LoggedUser: FC<Props> = (props: Props) => {
    if (props.user.logged) {
        return (
            <div style={{marginRight: "15px"}}>
                <Navbar.Text>
                    Přihlášen jako: <strong>{props.user.name}</strong>
                </Navbar.Text>
            </div>
        )
    }

    return <></>
};
