import {NextPage} from "next";
import {useRouter} from "next/router";
import {Button, Col, Row, Table} from "react-bootstrap";
import Head from "next/head";
import Medal from "../../components/Medal";

const Debl2023: NextPage = () => {

    const router = useRouter()

    return (
        <Row>
            <Head>
                <title>Tenisový turnaj čtyřher - 12. 8. 2023 - Hřiště Veselice</title>
            </Head>


            <Col>
                <h1>Tenisový turnaj čtyřher - 12.&nbsp;8.&nbsp;2023</h1>
                <ol>
                    <li><Medal type={"gold"}/> <strong>Jiří Fabiánek × Tomáš Kozák</strong></li>
                    <li><Medal type={"silver"}/> <strong>Josef Jarůšek × Marek Jarůšek</strong></li>
                    <li><Medal type={"bronze"}/> <strong>Martin Nečas × Jan Fabiánek</strong></li>
                    <li><strong>Pavel Stloukal × Jiří Skoták</strong></li>
                    <li><strong>Hanička Hebelková × Honza Hebelka</strong></li>
                    <li><strong>Daniel Orálek × Renata Žižlavská (Lubomír Němec)</strong></li>
                </ol>

                <h2>Výsledky</h2>
                <Table bordered={true} responsive={true} className={"results"}>
                    <thead>
                    <tr>
                        <th></th>
                        <th>Nečas × Fabiánek</th>
                        <th>Hebelková × Hebelka</th>
                        <th>Jarůšek × Jarůšek</th>
                        <th>Stloukal × Skoták</th>
                        <th>Fabiánek × Kozák</th>
                        <th>Orálek × Žižlavská</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th>Nečas × Fabiánek</th>
                        <td className={"void"}></td>
                        <td>7:6</td>
                        <td>3:6</td>
                        <td>6:3</td>
                        <td>1:6</td>
                        <td>6:2</td>
                    </tr>
                    <tr>
                        <th>Hebelková × Hebelka</th>
                        <td>6:7</td>
                        <td className={"void"}></td>
                        <td>2:6</td>
                        <td>0:6</td>
                        <td>2:6</td>
                        <td>6:0</td>
                    </tr>
                    <tr>
                        <th>Jarůšek × Jarůšek</th>
                        <td>6:3</td>
                        <td>6:2</td>
                        <td className={"void"}></td>
                        <td>6:2</td>
                        <td>6:7</td>
                        <td>6:2</td>
                    </tr>
                    <tr>
                        <th>Stloukal × Skoták</th>
                        <td>3:6</td>
                        <td>6:0</td>
                        <td>2:6</td>
                        <td className={"void"}></td>
                        <td>7:6</td>
                        <td>6:2</td>
                    </tr>
                    <tr>
                        <th>Fabiánek × Kozák</th>
                        <td>6:1</td>
                        <td>6:2</td>
                        <td>7:6</td>
                        <td>6:7</td>
                        <td className={"void"}></td>
                        <td>6:2</td>
                    </tr>
                    <tr>
                        <th>Orálek × Žižlavská</th>
                        <td>2:6</td>
                        <td>0:6</td>
                        <td>2:6</td>
                        <td>2:6</td>
                        <td>2:6</td>
                        <td className={"void"}></td>
                    </tr>
                    </tbody>
                </Table>
            </Col>
            <Col md={12}>
                <h2>Kola:</h2>
                <Table responsive={true}>
                    <tbody>
                    <tr>
                        <th colSpan={4}>1. kolo</th>
                    </tr>
                    <tr>
                        <td>Martin Nečas × Jan Fabiánek</td>
                        <td>vs.</td>
                        <td>Pavel Stloukal × Jiří Skoták</td>
                        <td style={{minWidth: "15%"}}>6 : 3</td>
                    </tr>
                    <tr>
                        <td>Hanička Hebelková × Honza Hebelka</td>
                        <td>vs.</td>
                        <td>Jiří Fabiánek × Tomáš Kozák</td>
                        <td>2 : 6</td>
                    </tr>
                    <tr>
                        <td>Josef Jarůšek × Marek Jarůšek</td>
                        <td>vs.</td>
                        <td>Daniel Orálek × Renata Žižlavská</td>
                        <td>6 : 2</td>
                    </tr>

                    <tr>
                        <th colSpan={4}>2. kolo</th>
                    </tr>
                    <tr>
                        <td>Martin Nečas × Jan Fabiánek</td>
                        <td>vs.</td>
                        <td>Hanička Hebelková × Honza Hebelka</td>
                        <td>7 : 6</td>
                    </tr>
                    <tr>
                        <td>Josef Jarůšek × Marek Jarůšek</td>
                        <td>vs.</td>
                        <td>Pavel Stloukal × Jiří Skoták</td>
                        <td>6 : 2</td>
                    </tr>
                    <tr>
                        <td>Daniel Orálek × Renata Žižlavská</td>
                        <td>vs.</td>
                        <td>Jiří Fabiánek × Tomáš Kozák</td>
                        <td>2 : 6</td>
                    </tr>

                    <tr>
                        <th colSpan={4}>3. kolo</th>
                    </tr>
                    <tr>
                        <td>Martin Nečas × Jan Fabiánek</td>
                        <td>vs.</td>
                        <td>Josef Jarůšek × Marek Jarůšek</td>
                        <td>3 : 6</td>
                    </tr>
                    <tr>
                        <td>Daniel Orálek × Renata Žižlavská</td>
                        <td>vs.</td>
                        <td>Hanička Hebelková × Honza Hebelka</td>
                        <td>0 : 6</td>
                    </tr>
                    <tr>
                        <td>Jiří Fabiánek × Tomáš Kozák</td>
                        <td>vs.</td>
                        <td>Pavel Stloukal × Jiří Skoták</td>
                        <td>6 : 7</td>
                    </tr>

                    <tr>
                        <th colSpan={4}>4. kolo</th>
                    </tr>
                    <tr>
                        <td>Martin Nečas × Jan Fabiánek</td>
                        <td>vs.</td>
                        <td>Daniel Orálek × Lubomír Němec</td>
                        <td>6 : 2</td>
                    </tr>
                    <tr>
                        <td>Jiří Fabiánek × Tomáš Kozák</td>
                        <td>vs.</td>
                        <td>Josef Jarůšek × Marek Jarůšek</td>
                        <td>7 : 6</td>
                    </tr>
                    <tr>
                        <td>Pavel Stloukal × Jiří Skoták</td>
                        <td>vs.</td>
                        <td>Hanička Hebelková × Honza Hebelka</td>
                        <td>6 : 0</td>
                    </tr>

                    <tr>
                        <th colSpan={4}>5. kolo</th>
                    </tr>
                    <tr>
                        <td>Martin Nečas × <span className="strike">Jan Fabiánek</span></td>
                        <td>vs.</td>
                        <td><span className="strike">Jiří Fabiánek</span> × Tomáš Kozák</td>
                        <td>1 : 6</td>
                    </tr>
                    <tr>
                        <td>Pavel Stloukal × Jiří Skoták</td>
                        <td>vs.</td>
                        <td>Daniel Orálek × Lubomír Němec</td>
                        <td>6 : 2</td>
                    </tr>
                    <tr>
                        <td><span className="strike">Hanička Hebelková</span> × Honza Hebelka</td>
                        <td>vs.</td>
                        <td><span className="strike">Josef Jarůšek</span> × Marek Jarůšek</td>
                        <td>2 : 6</td>
                    </tr>
                    </tbody>
                </Table>
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

export default Debl2023;
