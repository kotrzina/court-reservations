import {FC} from "react";
import {Button, Container, Nav, Navbar} from "react-bootstrap";
import Link from "next/link";
import {User} from "../src/user";
import {LoggedUser} from "./LoggedUser";

type Props = {
    user: User
    logout(): void
};
const Menu: FC<Props> = (props: Props) => {

    return (
        <Container>
            <Navbar bg="light" expand="lg">
                <Container>
                    <Link legacyBehavior={true} href={"/"} passHref>
                        <Navbar.Brand>Hřiště Veselice</Navbar.Brand>
                    </Link>
                    <Nav className="me-auto">
                        <Link legacyBehavior={true} href={"/admin"} passHref>
                            <Nav.Link hidden={!props.user.isAdmin}>Admin</Nav.Link>
                        </Link>
                        <Link legacyBehavior={true} href={"/info"} passHref>
                            <Nav.Link>Info</Nav.Link>
                        </Link>
                    </Nav>
                    <Navbar.Toggle/>
                    <Navbar.Collapse className="justify-content-end">
                        <LoggedUser user={props.user}/>

                        <Link legacyBehavior={true} href={"/login"} passHref>
                            <Button hidden={props.user.logged} variant={"success"}>Přihlásit</Button>
                        </Link>

                        <Link legacyBehavior={true} href={"/register"} passHref>
                            <Button hidden={props.user.logged} variant={"warning"}
                                    style={{marginLeft: "5px"}}>Registrovat</Button>
                        </Link>

                        <Button hidden={!props.user.logged} variant={"danger"} onClick={() => {
                            props.logout()
                        }}>Odhlásit</Button>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </Container>
    )
};


export default Menu;
