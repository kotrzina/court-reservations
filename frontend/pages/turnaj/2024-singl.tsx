import {NextPage} from "next";
import {useRouter} from "next/router";
import {Button, Col, Row, Table} from "react-bootstrap";
import Head from "next/head";
import {Flag} from "../../components/Flag";

const Singl2024: NextPage = () => {

    const router = useRouter()

    const cellStyles = {
        width: "9%",
    }

    const matchesSaturday = [
        {
            match: 1,
            time: "10:00",
            player1: "Tomáš Kozák",
            player2: "Radim Jarůšek",
            result: "6:3"
        },
        {
            match: 2,
            time: "čt 7:30*",
            player1: "Tomáš Kozák",
            player2: "Jiří Fabiánek",
            result: "6:3"
        },
        {
            match: 3,
            time: "12:00",
            player1: "Tomáš Kozák",
            player2: "Martin Nečas",
            result: "6:3"
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
            time: "14:00**",
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
            player1: "Tomáš Kozák",
            player2: "Jan Fabiánek",
            result: "X:X"
        },
        {
            match: 12,
            time: "09:00",
            player1: "Martin Nečas",
            player2: "Jiří Fabiánek",
            result: "X:X"
        },
        {
            match: 13,
            time: "10:00",
            player1: "Jiří Skoták",
            player2: "Jan Fabiánek",
            result: "X:X"
        },
        {
            match: 14,
            time: "11:00",
            player1: "Daniel Orálek",
            player2: "Tomáš Kozák",
            result: "X:X"
        },
        {
            match: 15,
            time: "12:00",
            player1: "Jan Fabiánek",
            player2: "Radim Jarůšek",
            result: "X:X"
        },
        {
            match: 16,
            time: "13:00",
            player1: "Daniel Orálek",
            player2: "Jiří Skoták",
            result: "X:X"
        },
        {
            match: 17,
            time: "14:00",
            player1: "Martin Nečas",
            player2: "Radim Jarůšek",
            result: "X:X"
        },
        {
            match: 18,
            time: "15:00",
            player1: "Tomáš Kozák",
            player2: "Jiří Skoták",
            result: "X:X"
        },
        {
            match: 19,
            time: "16:00",
            player1: "Daniel Orálek",
            player2: "Martin Nečas",
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
            time: "pá 19:00*",
            player1: "Jiří Fabiánek",
            player2: "Jan Fabiánek",
            result: "1:6"
        },
    ]

    return (
        <Row>
            <Head>
                <title>Tenisový turnaj - 24. - 25. 8. 2024 - Hřiště Veselice</title>
            </Head>

            <Col>
                <h1>Tenisový turnaj - 24.&nbsp;-&nbsp;25.&nbsp;8.&nbsp;2024</h1>
                <hr/>

                <h3>Pravidla</h3>
                <p>
                    <ul>
                        <li><strong>Datum:</strong> 📅 24.&nbsp;-&nbsp;25.&nbsp;8.&nbsp;2024</li>
                        <li><strong>Turnajový systém:</strong> ⚙️ Round Robin (každý s každým)</li>
                        <li><strong>Herní systém:</strong> 🎾 jeden set (tiebreak)</li>
                        <li><strong>Počet hráčů:</strong> ️‍⛹️‍♂️ 7</li>
                        <li><strong>Pricepool:</strong> 💰 čest a sláva</li>
                    </ul>

                </p>
                <p>
                    Protože nás bude jen 7, rozhodli jsme se změnit systém na Round Robin. Každý zápas se hraje na
                    jeden vítězný set. V případě shodného stavu 6:6 o vítězi rozhodne tiebreak. Turnaj je rozložen do
                    dvou herních dnů.
                </p>
                <p>
                    Rozlosování je uzpůsobeno běžcům, kteří si chtějí zaběhnout závod ve Vavřinču, a fotbalistům, kteří
                    mají v neděli v 17:00 mistrovské utkání okresního přeboru. Los proběhnul v pondělí kolem 20:00 na
                    Svazarmu za účasti notáře (Maruška Přikrylová). Bylo by dobré dodržovat časy zápasů, ale není to
                    nutné - vše na domluvě. Pokud někdo bude chtít začít dřív - není problém.
                </p>

                <h3>Tabulka výsledků:</h3>
                <Table bordered={true} responsive={true} className={"results"}>
                    <thead>
                    <tr>
                        <th style={{width: "18%"}}></th>
                        <th style={cellStyles} title={"Vítezství"}>W</th>
                        <th style={cellStyles} title={"Porážky"}>L</th>
                        <th style={cellStyles}>Daniel<br/>Orálek</th>
                        <th style={cellStyles}>Tomáš<br/>Kozák</th>
                        <th style={cellStyles}>Martin<br/>Nečas</th>
                        <th style={cellStyles}>Jiří<br/>Skoták</th>
                        <th style={cellStyles}>Jiří<br/>Fabiánek</th>
                        <th style={cellStyles}>Jan<br/>Fabiánek</th>
                        <th style={cellStyles}>Radim<br/>Jarůšek</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th>Daniel&nbsp;Orálek</th>
                        <td>0</td>
                        <td>0</td>
                        <td className={"void"}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <th>Tomáš&nbsp;Kozák</th>
                        <td>3</td>
                        <td>0</td>
                        <td></td>
                        <td className={"void"}></td>
                        <td>6:3</td>
                        <td></td>
                        <td>6:3</td>
                        <td></td>
                        <td>6:3</td>
                    </tr>
                    <tr>
                        <th>Martin&nbsp;Nečas</th>
                        <td>0</td>
                        <td>1</td>
                        <td></td>
                        <td>3:6</td>
                        <td className={"void"}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <th>Jiří&nbsp;Skoták</th>
                        <td>0</td>
                        <td>0</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={"void"}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <th>Jiří&nbsp;Fabiánek</th>
                        <td>0</td>
                        <td>2</td>
                        <td></td>
                        <td>3:6</td>
                        <td></td>
                        <td></td>
                        <td className={"void"}></td>
                        <td>1:6</td>
                        <td></td>
                    </tr>
                    <tr>
                        <th>Jan&nbsp;Fabiánek</th>
                        <td>1</td>
                        <td>0</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>6:1</td>
                        <td className={"void"}></td>
                        <td></td>
                    </tr>
                    <tr>
                        <th>Radim&nbsp;Jarůšek</th>
                        <td>0</td>
                        <td>1</td>
                        <td></td>
                        <td>3:6</td>
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

                <p>
                    * předehrávka <br/>
                    ** možno přesunout na konec herního dne
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
