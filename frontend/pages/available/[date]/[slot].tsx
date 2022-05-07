import React, {FC, useContext, useEffect, useState} from "react";
import {useRouter} from 'next/router'
import {Alert, Button, Col, Form, Row, Spinner} from "react-bootstrap";
import {Flash} from "../../../components/Flash";
import {useFlash} from "../../../src/useFlash";
import {fetchAvailable, postReservation, Reservation} from "../../../src/api";
import {formatDate, indexToTime} from "../../../src/utils";
import Link from "next/link";
import {UserContext} from "../../../src/UserContext";

const Available: FC = () => {

    const router = useRouter()
    const userContextData = useContext(UserContext)
    const [flash, setFlash] = useFlash()

    const [date, setDate] = useState<string>("")
    const [slot, setSlot] = useState<number>(-1)

    const [available, setAvailable] = useState<Array<Reservation>>([])
    const [showSpinner, setShowSpinner] = useState<boolean>(true)
    const [selectedSlot, setSelectedSlot] = useState<number>(-1)


    useEffect(() => {
        if (!router.isReady) return

        if (!userContextData.user.logged) {
            router.push("/login")
        }

        const queryDate = router.query.date as string
        const querySlot = parseInt(router.query.slot as string, 10)

        setDate(queryDate)
        setSlot(querySlot)

        fetchAvailable(queryDate, querySlot).then(data => {
            setAvailable(data.possibilities)
        }).catch((e) => {
            setFlash("error", "Chyba! Zkuste to prosim pozdeji")
        }).finally(() => {
            setShowSpinner(false)
        })
    }, [router.isReady])

    function onReserve() {
        postReservation(date, slot, selectedSlot).then(() => {
            router.push("/")
        }).catch(() => {
            setFlash("error", "Nelze rezervovat")
        })
    }

    return (
        <>
            <Flash flash={flash}/>
            <Row>
                <Col md={12}>
                    <h2>Rezervace</h2>
                    <ul>
                        <li><strong>Kdy:</strong> {formatDate(date)}</li>
                        <li><strong>Kdo:</strong> {userContextData.user.name}</li>
                        <li><strong>Kde:</strong> Hřiště Veselice</li>
                    </ul>
                    <h3>Čas:</h3>
                    <Alert hidden={!(!showSpinner && available.length == 0)} variant={"danger"}>
                        Žádné termíny nejsou k dispozici
                    </Alert>
                    <Spinner hidden={!showSpinner} animation="border" variant="success"/>
                    <Form>
                        {available.map((r) => (
                            <div key={`default-${r.date}-${r.slotFrom}-${r.slotTo}`} className="">
                                <Form.Check
                                    inline
                                    type={'radio'}
                                    id={`radio-${r.date}-${r.slotFrom}-${r.slotTo}`}
                                    label={`${indexToTime(r.slotFrom)} - ${indexToTime(r.slotTo + 1)}`}
                                    name={'day'}
                                    onClick={() => {
                                        setSelectedSlot(r.slotTo)
                                    }}
                                />
                            </div>
                        ))}

                        <div style={{marginTop: "10px"}}>
                            <Button disabled={selectedSlot === -1}
                                    variant={"success"}
                                    onClick={onReserve}>Rezervovat</Button>
                            <Link href={"/"} passHref>
                                <Button variant={"dark"}
                                        style={{marginLeft: "5px"}}>Zpět</Button>
                            </Link>
                        </div>
                    </Form>
                </Col>
            </Row>

        </>
    );
};

export default Available;
