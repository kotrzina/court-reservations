import {NextPage} from "next";
import {useRouter} from "next/router";
import {Button, Col, Row} from "react-bootstrap";
import Head from "next/head";

const Singl2024: NextPage = () => {

    const router = useRouter()

    const players = [
        "Tomáš Kozák",
        "Jan Fabiánek",
    ]

    const wikiDoubleElimination = "https://cs.wikipedia.org/wiki/Vy%C5%99azovac%C3%AD_syst%C3%A9m_na_dv%C4%9B_por%C3%A1%C5%BEky"

    return (
        <Row>
            <Head>
                <title>Tenisový turnaj - 24. - 25. 8. 2024 - Hřiště Veselice</title>
            </Head>


            <Col>
                <h1>Tenisový turnaj - 24.&nbsp;-&nbsp;25.&nbsp;8.&nbsp;2024</h1>
                <hr/>
                <h3>Registrovaní hráči</h3>
                <ul>
                    {players.map((player, index) => {
                        return <li key={index}>{player}</li>
                    })}
                </ul>

                <h3>Pravidla</h3>
                <p>
                    <ul>
                        <li><strong>Datum:</strong> 23.&nbsp;-&nbsp;24.&nbsp;8.&nbsp;2024 od 8-18</li>
                        <li><strong>Maximální počet hráčů:</strong> 10</li>
                        <li><strong>Registrace do:</strong> 17. 8. 2024 do 18:00</li>
                        <li><strong>Registrace u Tomáše Kozáka, popř. pomocí SMS na 730996957.</strong></li>
                        <li><strong>Turnajový systém:</strong> vyřazovací systém na dvě porážky</li>
                        <li><strong>Herní systém:</strong> jeden set (tiebreak)</li>
                    </ul>

                </p>
                <p>
                    Turnaj se bude hrát <a href={wikiDoubleElimination} target={"_blank"}>vyřazovacím systémem na dvě
                    porážky</a> (double elimination). Každý zápas se hraje na jeden vítězný set. V případě shodného
                    stavu 6:6 o vítězi rozhodne tiebreak. Turnaj je rozložen do dvou herních dnů. Přesný harmonogram
                    bude k dispozici po ukončení registrací.
                </p>

            </Col>


            <Col md={12}>
                <Button
                    variant={"outline-dark"}
                    className={"mb-3 mt-3"}
                    onClick={() => {
                        router.push("/")
                    }}
                >Zpět
                </Button>


            </Col>
        </Row>
    )
};

export default Singl2024;
