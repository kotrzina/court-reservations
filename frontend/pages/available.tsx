import React, {useContext, useEffect, useState} from "react";
import {useRouter} from 'next/router'
import {Alert, Button, Col, Form, Row, Spinner} from "react-bootstrap";
import {Flash} from "../components/Flash";
import {useFlash} from "../src/useFlash";
import {fetchAvailable, postReservation, Reservation} from "../src/api";
import {formatDate, getFullDayInWeek, indexToTime, slotsToDuration} from "../src/utils";
import Link from "next/link";
import {UserContext} from "../src/userContext";
import {NextPage} from "next";
import Head from "next/head";

const Available: NextPage = () => {

    const sports = [
        "Volejbal",
        "Nohejbal",
        "Děti",
        "Ostatní",
    ]

    const router = useRouter()
    const userContextData = useContext(UserContext)
    const [flash, setFlash] = useFlash()

    const [date, setDate] = useState<string>("")
    const [slot, setSlot] = useState<number>(-1)
    const [isPublic, setIsPublic] = useState<boolean>(false)
    const [sport, setSport] = useState<string>(sports[0])

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
        let note = ""
        if (isPublic) {
            note = sport
        }
        postReservation(date, slot, selectedSlot, isPublic, note).then(() => {
            setDone(true)
            setFlash("ok", "Rezervace byla úspěšně vytvořena.")
        }).catch(() => {
            setFlash("error", "Nelze rezervovat.")
        })
    }

    function label(r: Reservation) {
        return (
            <>
                <strong>{slotsToDuration(r.slotFrom, r.slotTo)}</strong> ({indexToTime(r.slotFrom)} - {indexToTime(r.slotTo + 1)})
            </>
        )
    }

    return (
        <>
            <Head>
                <title>Výběr termínu - Hřiště Veselice</title>
            </Head>

            <Flash flash={flash}/>
            <Row>
                <Col md={5}>
                    <h3>Rezervace</h3>
                    <ul>
                        <li><strong>Kdy:</strong> {getFullDayInWeek(date)} {formatDate(date)}</li>
                        <li><strong>Kdo:</strong> {userContextData.user.name}</li>
                        <li><strong>Kde:</strong> Hřiště Veselice</li>
                    </ul>
                    <h4>Typ rezervace:</h4>
                    <Alert hidden={!(!showSpinner && available.length == 0)} variant={"danger"}>
                        Žádné termíny nejsou k dispozici
                    </Alert>
                    <Spinner hidden={!showSpinner} animation="border" variant="success"/>
                    <Form>

                        <Form.Check
                            type="checkbox"
                            id={"isPublicCheckbox"}
                            label={"Veřejná událost"}
                            checked={isPublic}
                            onChange={(e) => {
                                setIsPublic(e.target.checked)
                            }}/>
                        <Form.Select
                            hidden={!isPublic}
                            value={sport}
                            onChange={e => {
                                setSport(e.target.value)
                            }}>
                            {sports.map(s => {
                                return (
                                    <option value={s} key={s}>{s}</option>
                                )
                            })}
                        </Form.Select>

                        <Form.Text className="text-muted">
                            Dejte ostatním vědět, že se k Vám mohou přidat.
                        </Form.Text>

                        <h4>Délka rezervace:</h4>
                        {available.map((r) => (
                            <div key={`default-${r.date}-${r.slotFrom}-${r.slotTo}`}>
                                <Form.Check
                                    inline
                                    disabled={done}
                                    type={'radio'}
                                    id={`radio-${r.date}-${r.slotFrom}-${r.slotTo}`}
                                    label={label(r)}
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
                            <Button
                                disabled={selectedSlot === -1}
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
