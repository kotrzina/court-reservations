import {NextPage} from "next";
import {useRouter} from "next/router";
import {Button, Col, Row, Table} from "react-bootstrap";
import Head from "next/head";
import {Flag} from "../../components/Flag";

const Singl2024: NextPage = () => {

    const router = useRouter()

    const matchesSaturday = [
        {
            match: 1,
            time: "10:00",
            player1: "Tomáš Kozák",
            player2: "Radim Jarůšek",
            result: "X:X"
        },
        {
            match: 2,
            time: "7:00*",
            player1: "Tomáš Kozák",
            player2: "Jiří Fabiánek",
            result: "X:X"
        },
        {
            match: 3,
            time: "12:00",
            player1: "Tomáš Kozák",
            player2: "Martin Nečas",
            result: "X:X"
        },
        {
            match: 4,
            time: "13:00",
            player1: "Jiří Fabiánek",
            player2: "Radim Jarůšek",
            result: "X:X"
        },
        {
            match: 5,
            time: "14:00",
            player1: "Daniel Orálek",
            player2: "Jan Fabiánek",
            result: "X:X"
        },
        {
            match: 6,
            time: "15:00",
            player1: "Martin Nečas",
            player2: "Jiří Skoták",
            result: "X:X"
        },
        {
            match: 7,
            time: "16:00",
            player1: "Daniel Orálek",
            player2: "Radim Jarůšek",
            result: "X:X"
        },
        {
            match: 8,
            time: "17:00",
            player1: "Jiří Skoták",
            player2: "Jiří Fabiánek",
            result: "X:X"
        },
        {
            match: 9,
            time: "18:00",
            player1: "Martin Nečas",
            player2: "Jan Fabiánek",
            result: "X:X"
        },
        {
            match: 10,
            time: "19:00",
            player1: "Daniel Orálek",
            player2: "Jiří Fabiánek",
            result: "X:X"
        },
    ]

    const matchesSunday = [
        {
            match: 11,
            time: "08:00",
            player1: "Jiří Skoták",
            player2: "Jan Fabiánek",
            result: "X:X"
        },
        {
            match: 12,
            time: "09:00",
            player1: "Martin Nečas",
            player2: "Radim Jarůšek",
            result: "X:X"
        },
        {
            match: 13,
            time: "10:00",
            player1: "Daniel Orálek",
            player2: "Jiří Skoták",
            result: "X:X"
        },
        {
            match: 14,
            time: "11:00",
            player1: "Martin Nečas",
            player2: "Jiří Fabiánek",
            result: "X:X"
        },
        {
            match: 15,
            time: "12:00",
            player1: "Tomáš Kozák",
            player2: "Jan Fabiánek",
            result: "X:X"
        },
        {
            match: 16,
            time: "13:00",
            player1: "Daniel Orálek",
            player2: "Martin Nečas",
            result: "X:X"
        },
        {
            match: 17,
            time: "14:00",
            player1: "Tomáš Kozák",
            player2: "Jiří Skoták",
            result: "X:X"
        },
        {
            match: 18,
            time: "15:00",
            player1: "Jan Fabiánek",
            player2: "Radim Jarůšek",
            result: "X:X"
        },
        {
            match: 19,
            time: "16:00",
            player1: "Daniel Orálek",
            player2: "Tomáš Kozák",
            result: "X:X"
        },
        {
            match: 20,
            time: "17:00",
            player1: "Jiří Skoták",
            player2: "Radim Jarůšek",
            result: "X:X"
        },
        {
            match: 21,
            time: "18:00",
            player1: "Jiří Fabiánek",
            player2: "Jan Fabiánek",
            result: "X:X"
        },
    ]
    
    return (
        <Row>
            <Head>
                <title>Tenisový turnaj - 24. - 25. 8. 2024 - Hřiště Veselice</title>
            </Head>

            <Col>
                <h1>Tenisový turnaj - 24.&nbsp;-&nbsp;25.&nbsp;8.&nbsp;2024</h1>

                <Table bordered={true} responsive={true} className={"results"}>
                    <thead>
                    <tr>
                        <th></th>
                        <th style={{width: "12.5%"}}>Daniel Orálek</th>
                        <th style={{width: "12.5%"}}>Tomáš Kozák</th>
                        <th style={{width: "12.5%"}}>Martin Nečas</th>
                        <th style={{width: "12.5%"}}>Jiří Skoták</th>
                        <th style={{width: "12.5%"}}>Jiří Fabiánek</th>
                        <th style={{width: "12.5%"}}>Jan Fabiánek</th>
                        <th style={{width: "12.5%"}}>Radim Jarůšek</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th>Daniel Orálek</th>
                        <td className={"void"}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <th>Tomáš Kozák</th>
                        <td></td>
                        <td className={"void"}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <th>Martin Nečas</th>
                        <td></td>
                        <td></td>
                        <td className={"void"}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <th>Jiří Skoták</th>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={"void"}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <th>Jiří Fabiánek</th>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={"void"}></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <th>Jan Fabiánek</th>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={"void"}></td>
                        <td></td>
                    </tr>
                    <tr>
                        <th>Radim Jarůšek</th>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={"void"}></td>
                    </tr>
                    </tbody>
                </Table>
            </Col>

            <Col md={12}>
                <h4>Sobota</h4>
                <Table bordered={true} responsive={true}>
                    {matchesSaturday.map((match, index) => {
                        return (
                            <tr key={index}>
                                <td>{match.match}.</td>
                                <td>{match.time}</td>
                                <td><Flag nation={"cze"}/>{match.player1} × <Flag nation={"cze"}/>{match.player2}</td>
                                <td>{match.result}</td>
                            </tr>
                        )
                    })}
                </Table>

                <h4>Neděle</h4>
                <Table bordered={true} responsive={true}>
                    {matchesSunday.map((match, index) => {
                        return (
                            <tr key={index}>
                                <td>{match.match}.</td>
                                <td>{match.time}</td>
                                <td><Flag nation={"cze"}/>{match.player1} × <Flag nation={"cze"}/>{match.player2}</td>
                                <td>{match.result}</td>
                            </tr>
                        )
                    })}
                </Table>

                <p>* předehra přes týden</p>


                <h3>Pravidla</h3>
                <p>
                    <ul>
                        <li><strong>Datum:</strong> 24.&nbsp;-&nbsp;25.&nbsp;8.&nbsp;2024</li>
                        <li><strong>Turnajový systém:</strong> Round Robin (každý s každým)</li>
                        <li><strong>Herní systém:</strong> jeden set (tiebreak)</li>
                    </ul>

                </p>
                <p>
                    Protože nás bude jen 7, rozhodli jsme se změnit systém na Round Robin. Každý zápas se hraje na
                    jeden vítězný set. V případě shodného stavu 6:6 o vítězi rozhodne tiebreak. Turnaj je rozložen do
                    dvou herních dnů.
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
