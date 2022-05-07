import type {NextPage} from 'next'
import React, {useEffect, useState} from "react";
import {Col, Row, Table} from "react-bootstrap";
import {fetchTimeTable, TimeTable} from "../src/api";
import {TableHead} from "../components/TableHead";
import {TableBody} from "../components/TableBody";
import {useFlash} from "../src/useFlash";
import {Flash} from "../components/Flash";

const Home: NextPage = () => {

    const [table, setTable] = useState<TimeTable>({timeTable: []})
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
                <Col md={12}>
                    <Table responsive={true}>
                        <TableHead/>
                        <TableBody table={table}/>
                    </Table>
                </Col>
            </Row>
        </>
    )
}

export default Home
