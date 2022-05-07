import React, {FC, useContext, useEffect, useState} from "react";
import {Button, Col, Form, Row} from "react-bootstrap";
import {useFlash} from "../src/useFlash";
import {Flash} from "../components/Flash";
import {postLogin} from "../src/api";
import {User} from "../src/user";
import {useRouter} from "next/router";
import {UserContext} from "../src/UserContext";

const Register: FC = () => {

    const {login} = useContext(UserContext)
    const router = useRouter()

    const [flash, setFlash] = useFlash()
    const [name, setName] = useState<string>("")
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [passwordCheck, setPasswordCheck] = useState<string>("")
    const [code, setCode] = useState<string>("")

    const [nameValid, setNameValid] = useState<boolean>(false)
    const [usernameValid, setUsernameValid] = useState<boolean>(false)
    const [passwordValid, setPasswordValid] = useState<boolean>(false)
    const [passwordSame, setPasswordSame] = useState<boolean>(false)
    const [codeValid, setCodeValid] = useState<boolean>(false)

    useEffect(() => {
        if (password.length < 5) {

        }
    }, [name, username, password, passwordCheck, code])

    function onRegister() {
        if (password.length < 5) {
            setFlash("error", "")
            return
        }

        if (password !== passwordCheck) {
            setFlash("error", "")
            return
        }


        postLogin(username, password).then(data => {
            const u: User = {
                logged: true,
                name: data.name,
                username: username,
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
                <h2>Registrace:</h2>
                <Flash flash={flash}/>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="name"
                            placeholder="Vaše celé jméno"
                            onChange={e => setName(e.target.value)}
                        />
                        <Form.Text className="text-muted">
                            Jméno bude viditelné u vašich rezervací.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Control
                            type="name"
                            placeholder="Přihlašovací jméno"
                            onChange={e => setUsername(e.target.value)}
                        />
                        <Form.Text className="text-muted">
                            Tímto jménem se budete přihlašovat.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Control
                            type="password"
                            placeholder="Heslo"
                            isInvalid={!passwordValid}
                            onChange={e => {
                                setPassword(e.target.value)
                            }}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Control
                            type="password"
                            placeholder="Heslo znovu"
                            isInvalid={!passwordSame}
                            onChange={e => {
                                setPasswordCheck(e.target.value)
                            }}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Control
                            type="code"
                            placeholder="Tajný kód"
                            onChange={e => setCode(e.target.value)}
                        />
                        <Form.Text className="text-muted">
                            Tajný kód neleznete na vstupu do kurtu nebo vám ho řekne kdokoliv z Veselice. Takže úplně
                            tajný není. :)
                        </Form.Text>
                    </Form.Group>

                    <Button variant="success" type="submit" onClick={e => {
                        e.preventDefault()
                        onRegister()
                    }}>
                        Přihlásit se
                    </Button>
                </Form>
            </Col>
        </Row>
    );
};

export default Register;
