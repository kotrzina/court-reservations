import React, {useEffect, useState} from "react";
import {Alert, Button, Col, Form, Row} from "react-bootstrap";
import {useRouter} from "next/router";
import {NextPage} from "next";
import Head from "next/head";
import {Flash} from "../components/Flash";
import {useFlash} from "../src/useFlash";
import {changePassword} from "../src/api";


type Jwt = {
    username: string;
    exp: number;
    iss: string;
    nbf: number;
}

const Pwd: NextPage = () => {

    const [flash, setFlash] = useFlash()
    const router = useRouter()

    const [token, setToken] = useState<string>("")
    const [username, setUsername] = useState<string>("")
    const [exp, setExp] = useState<string>("")
    const [expired, setExpired] = useState<boolean>(false)

    const [passwordValid, setPasswordValid] = useState<boolean>(true)
    const [password, setPassword] = useState<string>("")
    const [passwordCheck, setPasswordCheck] = useState<string>("")

    useEffect(() => {
        if (!router.isReady) return

        try {
            const t = router.query.token as string
            setToken(t)
            const now = new Date()
            const jwt = parseJwt(t)
            const exp = new Date(jwt.exp * 1000)
            setUsername(jwt.username)
            setExp(exp.toLocaleString());
            setExpired(exp.getTime() <= now.getTime())
        } catch (e) {
            alert(e)
            void router.push("/")
        }
    }, [router.isReady])

    // https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
    function parseJwt(token: string): Jwt {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }

    async function onPasswordChange() {
        if (password.length < 5) {
            setPasswordValid(false)
            setFlash("error", "Heslo musí mít alespoň 5 znaků")
            return
        }
        if (password !== passwordCheck) {
            setPasswordValid(false)
            setFlash("error", "Hesla se neshodují")
            return
        }

        try {
            await changePassword(token, password)
        } catch (e) {
            setFlash("error", "Heslo nejde změnit")
            return
        }

        setPasswordValid(true)
        setFlash("ok", "Změna hesla proběhla úspěšně. Můžeš se přihlásit.")
        setPassword("")
        setPasswordCheck("")
    }

    return (
        <Row>
            <Head>
                <title>Změna hesla - Hřiště Veselice</title>
            </Head>

            <Col md={12}>
                <h2>Změna hesla</h2>
                <ul>
                    <li><strong>Uživatel: </strong>{username}</li>
                    <li><strong>Změna možná do: </strong>{exp}</li>
                </ul>

                {expired && <Alert variant={"danger"}>
                    Vypadá to, že odkaz na změnu hesla expiroval. Zažádej si o nový.
                </Alert>}

                <Flash flash={flash}/>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="password"
                            value={password}
                            placeholder="Heslo"
                            isInvalid={!passwordValid}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Control
                            type="password"
                            value={passwordCheck}
                            placeholder="Heslo znovu"
                            isInvalid={!passwordValid}
                            onChange={e => setPasswordCheck(e.target.value)}
                        />
                    </Form.Group>

                    <Button variant="success" type="submit" onClick={e => {
                        e.preventDefault()
                        void onPasswordChange()
                    }}>
                        Změnit heslo
                    </Button>
                </Form>
            </Col>
        </Row>
    );
};

export default Pwd;
