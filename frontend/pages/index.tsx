import type {NextPage} from 'next'
import React, {useEffect, useState} from "react";
import {Col, Row, Table} from "react-bootstrap";
import {fetchTimeTable, TimeTable} from "../src/api";
import {TableHead} from "../components/TableHead";
import {TableBody} from "../components/TableBody";
import {useFlash} from "../src/useFlash";
import {Flash} from "../components/Flash";
import {ReservationsList} from "../components/ReservationsList";
import {AccordionBody} from "../components/AccordionBody";

const Home: NextPage = () => {

    const [table, setTable] = useState<TimeTable>({timeTable: [], todayReservations: [], userReservations: []})
    const [flash, updateFlash] = useFlash()


    useEffect(() => {
        fetchData()
    }, [])

    function fetchData() {
        fetchTimeTable().then(data => {
            setTable(data)
        }).catch(error => {
            updateFlash("error", "Nelze načíst rezervace ze serveru. Zkus to prosím později.")
        })
    }

    return (
        <>
            <Flash flash={flash}/>

            <Row>
                <Col md={6} style={{marginTop: "20px"}}>
                    <ReservationsList title={"Vaše rezervace:"} reservations={table.userReservations}/>
                </Col>

                <Col md={6} style={{marginTop: "20px"}}>
                    <ReservationsList title={"Dnešní rezervace:"} reservations={table.todayReservations}/>
                </Col>
            </Row>

            <Row>
                <Col className={'d-none d-sm-none d-md-block d-lg-block d-xl-block'} md={12}
                     style={{marginTop: "30px"}}>
                    <Table className={'tableView'} responsive={true}>
                        <TableHead/>
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
