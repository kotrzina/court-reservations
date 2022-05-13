import React, {useEffect, useState} from "react";
import {Button, Col, Form, Row} from "react-bootstrap";
import {useFlash} from "../src/useFlash";
import {Flash} from "../components/Flash";
import {postRegister} from "../src/api";
import Link from "next/link";
import {NextPage} from "next";
import Head from "next/head";

const Register: NextPage = () => {

    const [flash, setFlash] = useFlash()
    const [name, setName] = useState<string>("")
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [passwordCheck, setPasswordCheck] = useState<string>("")
    const [city, setCity] = useState<string>("")
    const [code, setCode] = useState<string>("")
    const [rights, setRights] = useState<boolean>(true)

    const [nameValid, setNameValid] = useState<boolean>(false)
    const [usernameValid, setUsernameValid] = useState<boolean>(false)
    const [passwordValid, setPasswordValid] = useState<boolean>(false)
    const [passwordSame, setPasswordSame] = useState<boolean>(false)
    const [cityValid, setCityValid] = useState<boolean>(false)
    const [codeValid, setCodeValid] = useState<boolean>(false)
    const [allValid, setAllValid] = useState<boolean>(false)

    useEffect(() => {
        revalidate()
    }, [name, username, password, passwordCheck, city, code, rights])

    function revalidate(): void {
        setNameValid(name.length >= 5)
        setUsernameValid(username.length >= 3)
        setPasswordValid(password.length >= 5)
        setPasswordSame(passwordCheck == password && passwordCheck.length > 0)
        setCityValid(city.length > 2)
        setCodeValid(code.length > 0)

        setAllValid(nameValid && usernameValid && passwordValid && passwordSame && codeValid && rights)
    }

    function onRegister() {
        postRegister(username, password, name, city, code).then(data => {
            setFlash("ok", "Registrace proběhla úspěšně. Můžete se přihlásit")
            setName("")
            setUsername("")
            setPassword("")
            setPasswordCheck("")
            setCity("")
            setCode("")
        }).catch(() => {
            setFlash("error", "Chyba registrace")
        })
    }

    function rightsLabel(): JSX.Element {
        return (
            <>
                Souhlasím s <Link href={"/info"}>podmínkami registrace</Link>
            </>
        )
    }

    return (
        <Row>
            <Head>
                <title>Registrace - Hřiště Veselice</title>
            </Head>

            <Col md={4}>
                <h2>Registrace:</h2>
                <Flash flash={flash}/>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Control
                            value={name}
                            isInvalid={!nameValid}
                            placeholder="Vaše celé jméno"
                            onChange={e => setName(e.target.value)}
                        />
                        <Form.Text className="text-muted">
                            Jméno bude viditelné u vašich rezervací.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Control
                            value={username}
                            isInvalid={!usernameValid}
                            placeholder="Přihlašovací jméno"
                            onChange={e => setUsername(e.target.value)}
                        />
                        <Form.Text className="text-muted">
                            Tímto jménem se budete přihlašovat.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Control
                            value={password}
                            type="password"
                            isInvalid={!passwordValid}
                            placeholder="Heslo"
                            onChange={e => {
                                setPassword(e.target.value)
                            }}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Control
                            value={passwordCheck}
                            type="password"
                            isInvalid={!passwordSame}
                            placeholder="Heslo znovu"
                            onChange={e => {
                                setPasswordCheck(e.target.value)
                            }}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Control
                            value={city}
                            isInvalid={!cityValid}
                            placeholder="Obec"
                            onChange={e => setCity(e.target.value)}
                        />
                        <Form.Text className="text-muted">
                            Veselice, Suchdol,...
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Control
                            value={code}
                            isInvalid={!codeValid}
                            placeholder="Tajný kód"
                            onChange={e => setCode(e.target.value)}
                        />
                        <Form.Text className="text-muted">
                            Tajný kód neleznete na vstupu do kurtu nebo vám ho řekne kdokoliv z Veselice. Takže úplně
                            tajný není. :)
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Check
                            type="checkbox"
                            label={rightsLabel()}
                            checked={rights}
                            isInvalid={!rights}
                            onChange={(e) => {
                                setRights(e.target.checked)
                            }}/>
                    </Form.Group>

                    <Button variant="success" type="submit" disabled={!allValid} onClick={e => {
                        e.preventDefault()
                        onRegister()
                    }}>
                        Zaregistrovat se
                    </Button>
                </Form>
            </Col>
        </Row>
    );
};

export default Register;
