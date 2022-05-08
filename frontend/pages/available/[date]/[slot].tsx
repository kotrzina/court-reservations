import React, {FC, useContext, useEffect, useState} from "react";
import {useRouter} from 'next/router'
import {Alert, Button, Col, Form, Row, Spinner} from "react-bootstrap";
import {Flash} from "../../../components/Flash";
import {useFlash} from "../../../src/useFlash";
import {fetchAvailable, postReservation, Reservation} from "../../../src/api";
import {formatDate, getDayInWeek, getFullDayInWeek, indexToTime} from "../../../src/utils";
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
    const [done, setDone] = useState<boolean>(false)


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
            setAvailable(data)
        }).catch((e) => {
            setFlash("error", "Chyba! Zkuste to prosim pozdeji")
        }).finally(() => {
            setShowSpinner(false)
        })
    }, [router.isReady])

    function onReserve() {
        postReservation(date, slot, selectedSlot).then(() => {
            setDone(true)
            setFlash("ok", "Rezervace byla úspěšně vytvořena.")
        }).catch(() => {
            setFlash("error", "Nelze rezervovat.")
        })
    }

    return (
        <>
            <Flash flash={flash}/>
            <Row>
                <Col md={12}>
                    <h3>Rezervace</h3>
                    <ul>
                        <li><strong>Kdy:</strong> {getFullDayInWeek(date)} {formatDate(date)}</li>
                        <li><strong>Kdo:</strong> {userContextData.user.name}</li>
                        <li><strong>Kde:</strong> Hřiště Veselice</li>
                    </ul>
                    <h4>Časové okno:</h4>
                    <Alert hidden={!(!showSpinner && available.length == 0)} variant={"danger"}>
                        Žádné termíny nejsou k dispozici
                    </Alert>
                    <Spinner hidden={!showSpinner} animation="border" variant="success"/>
                    <Form>
                        {available.map((r) => (
                            <div key={`default-${r.date}-${r.slotFrom}-${r.slotTo}`}>
                                <Form.Check
                                    inline
                                    disabled={done}
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
                        <Form.Text className="text-muted">
                            Pokud je zrovna volno, můžete vytvořit až <strong>dvouhodinovou</strong> rezervaci.
                        </Form.Text>
                        <div style={{marginTop: "10px"}}>
                            <Button disabled={selectedSlot === -1}
                                    variant={"success"}
                                    onClick={onReserve}
                                    hidden={done}
                            >Rezervovat</Button>
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
