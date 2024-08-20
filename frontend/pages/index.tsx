import type {NextPage} from 'next'
import React, {useEffect, useState} from "react";
import {Alert, Button, Col, Row, Spinner, Table} from "react-bootstrap";
import {Reservation, TimeTable} from "../src/api";
import {TableHead} from "../components/TableHead";
import {TableBody} from "../components/TableBody";
import {useFlash} from "../src/useFlash";
import {Flash} from "../components/Flash";
import {ReservationsList} from "../components/ReservationsList";
import {AccordionBody} from "../components/AccordionBody";
import Head from "next/head";

const Home: NextPage = () => {

    const [table] = useState<TimeTable>({
        timeTable: [],
        reservations: [],
        todayReservations: [],
        userReservations: []
    })
    const [flash, updateFlash] = useFlash()
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        fetchData()
        window.addEventListener("focus", fetchData)
        return () => {
            window.removeEventListener("focus", fetchData)
        }
    }, [])


    function fetchData() {
        setLoading(false)
        return
    }

    function myReservationFilter(r: Reservation): boolean {
        return r.isActive
    }

    function publicEventFilter(r: Reservation): boolean {
        return !!(r.isActive && r.note && r.note.length > 0)
    }

    const url = "https://www.vavrinec.cz/obec/volny-cas/rezervace/viceucelove-hriste-ve-veselici/rezervace/?kalendar_id=1&step=2"

    return (
        <>
            <Head>
                <title>Rezervace - Hřiště Veselice</title>
            </Head>

            <Row>
                <Col md={12}>
                    <Alert variant={"success"}>
                        <Alert.Heading>Nový rezervační systém</Alert.Heading>
                        <p>
                            V rámci vybudovaní nového multifunkčního hřiště ve Vavřinci obec spustila nový rezervační
                            systém i pro hřiště ve Veselici.
                        </p>
                        <hr/>
                        <div className="d-flex">
                            <Button href={url} variant="outline-success">
                                Pokračovat do nového systému
                            </Button>
                        </div>
                    </Alert>
                </Col>
            </Row>

            <Flash flash={flash}/>
            {/*{ts <= 1691784000000 && <AlertBanner*/}
            {/*    variant={"primary"}*/}
            {/*    title={"Tenisový turnaj čtyřher - 12. 8. 2023"}*/}
            {/*    linkTitle={"Více informací"}*/}
            {/*    linkPage={"/tour"}*/}
            {/*/>}*/}
            <Row>
                <Col md={4}
                     style={{marginTop: "20px"}}
                     hidden={table.todayReservations.length === 0}
                >
                    <ReservationsList
                        title={"DNES:"}
                        reservations={table.todayReservations}
                        reload={fetchData}
                        setFlash={updateFlash}
                    />
                </Col>
                <Col md={4}
                     style={{marginTop: "20px"}}
                     hidden={table.userReservations.filter(myReservationFilter).length === 0}
                >
                    <ReservationsList
                        title={"MOJE REZERVACE:"}
                        reservations={table.userReservations.filter(myReservationFilter)}
                        reload={fetchData}
                        setFlash={updateFlash}
                    />
                </Col>
                <Col md={4}
                     style={{marginTop: "20px"}}
                     hidden={table.userReservations.filter(publicEventFilter).length === 0}
                >
                    <ReservationsList
                        title={"VEŘEJNÉ UDÁLOSTI:"}
                        reservations={table.reservations.filter(publicEventFilter)}
                        reload={fetchData}
                        setFlash={updateFlash}
                    />
                </Col>
            </Row>

            <Row hidden={true}>
                <Spinner animation={"border"} variant={"success"} style={{margin: "0 auto"}} hidden={!loading}/>

                <Col className={'d-none d-sm-none d-md-block d-lg-block d-xl-block'} md={12}
                     style={{marginTop: "30px"}}>
                    <Table className={'tableView'} responsive={true}>
                        <TableHead table={table}/>
                        <TableBody table={table}/>
                    </Table>
                </Col>

                <Col className={'d-block d-sm-block d-md-none d-lg-none d-xl-none'} md={12} style={{marginTop: "30px"}}>
                    <AccordionBody table={table}/>
                </Col>
            </Row>
        </>
    )
}


export default Home
