import React, { useContext, useState} from "react";
import {Button, Col, Form, Row} from "react-bootstrap";
import {useFlash} from "../src/useFlash";
import {Flash} from "../components/Flash";
import {postLogin} from "../src/api";
import {User} from "../src/user";
import {useRouter} from "next/router";
import {UserContext} from "../src/UserContext";
import {NextPage} from "next";

const Login: NextPage = () => {

    const {login} = useContext(UserContext)
    const router = useRouter()

    const [flash, setFlash] = useFlash()
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    function onLogin() {
        postLogin(username, password).then(data => {
            const u: User = {
                logged: true,
                name: data.name,
                username: username,
                isAdmin: data.isAdmin,
                jwt: data.jwt,
            }
            login(u)
            router.push("/")
        }).catch(() => {
            setFlash("error", "Chyba přihlášení")
        })
    }

    return (
        <Row>
            <Col md={4}>
                <h2>Přihlášení:</h2>
                <Flash flash={flash}/>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Control type="name" placeholder="Přihlašovací jméno"
                                      onChange={e => setUsername(e.target.value)}/>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Control type="password" placeholder="Heslo" onChange={e => setPassword(e.target.value)}/>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Text className="text-muted">
                            Pokud jste heslo zapomněli, napište na kozak@talko.cz
                        </Form.Text>
                    </Form.Group>

                    <Button variant="success" type="submit" onClick={e => {
                        e.preventDefault()
                        onLogin()
                    }}>
                        Přihlásit se
                    </Button>
                </Form>
            </Col>
        </Row>
    );
};

export default Login;
