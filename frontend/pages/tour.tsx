import {Button, Col, Row} from "react-bootstrap";
import {NextPage} from "next";
import Head from "next/head";
import React, {useContext} from "react";
import {UserContext} from "../src/userContext";
import RegistrationForm from "../components/RegistrationForm";
import {useRouter} from "next/router";
import {Player, RegisteredPlayer} from "../components/RegisteredPlayer";

const Tour: NextPage = () => {

    const router = useRouter()
    const user = useContext(UserContext)

    const data: [Player, Player][] = [
        [
            {name: "Jiří Fabiánek", nation: "cze"},
            {name: "Tomáš Kozák", nation: "cze"},
        ],
    ]

    return (
        <Row>
            <Head>
                <title>Tenisový turnaj čtyřher - Hřiště Veselice</title>
            </Head>

            <Col md={12}>
                <Button
                    variant={"outline-dark"}
                    className={"mb-3 mt-3"}
                    onClick={() => {
                        router.push("/")
                    }}
                >Zpět
                </Button>
                <h1>Tenisový turnaj čtyřher - 12.&nbsp;8.&nbsp;2023</h1>
                <p>
                    Turnaj o přeborníky obce. Zaregistrovat se může kdokoliv. Páry jsou zaregistrovány předem a
                    během turnaje se nemohou měnit.
                </p>
                <ul>
                    <li><strong>Kdy:</strong> v sobotu 12.&nbsp;8.&nbsp;2023 od 8:00</li>
                    <li><strong>Kde:</strong> sportovní areál ve Veselici</li>
                    <li><strong>Startovné:</strong> zdarma</li>
                </ul>
                <h2>Pravidla</h2>
                <p>
                    Hra na jeden vítězný set metodou Round Robin (každý s každým). V případě nerozhodného výsledku (6:6)
                    rozhodne tiebreak (zkrácená hra). Vítězí pár s nejvyšším počtem vítězství. V případě schody je
                    rozhodující vzájemný zápas.
                </p>

                {user.user.logged && <RegisteredPlayer double={data}/>}
                {user.user.logged && <RegistrationForm/>}
            </Col>
        </Row>
    )
};

export default Tour;
