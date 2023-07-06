import React, {useContext, useEffect, useState} from "react";
import {UserContext} from "../src/userContext";
import {Button, Col, Row, Table} from "react-bootstrap";
import {
    deleteReservation,
    deleteUser,
    fetchAllReservations,
    fetchUsers,
    generatePasswordToken, PasswordTokenResponse,
    Reservation,
    UserListItem
} from "../src/api";
import {useRouter} from "next/router";
import {formatDate, indexToTime, slotsToDuration} from "../src/utils";
import {NextPage} from "next";
import Head from "next/head";
import {Clock} from "../components/Clock";


const Admin: NextPage = () => {

    const {user} = useContext(UserContext)
    const router = useRouter()

    const [reservations, setReservations] = useState<Reservation[]>([])
    const [users, setUsers] = useState<UserListItem[]>([])

    useEffect(() => {
        if (!user.logged || !user.isAdmin) {
            router.push("/")
            return
        }

        fetch()
    }, [])

    function fetch() {
        fetchAllReservations().then(d => {
            setReservations(d)
        }).catch(e => {
            alert(e.toString())
        })

        fetchUsers().then(d => {
            setUsers(d)
        }).catch(e => {
            alert(e.toString())
        })
    }

    function onDeleteReservation(r: Reservation) {
        const y = confirm(`Opravdu smazat rezervaci ${r.date} ${indexToTime(r.slotFrom)} - ${indexToTime(r.slotTo + 1)}?`)
        if (y) {
            deleteReservation(r.date, r.slotFrom).then(() => {
                fetch()
            }).catch(e => {
                alert(e.toString())
            })
        }
    }

    function onDeleteUser(u: UserListItem) {
        const y = confirm(`Opravdu smazat uzivatele ${u.name} (${u.username})?`)
        if (y) {
            deleteUser(u.username).then(() => {
                fetch()
            }).catch(e => {
                alert(e.toString())
            })
        }
    }

    async function onGeneratePasswordToken(u: UserListItem) {
        const msg = `Opravdu generovat token na zmenu hesla pro uzivatele ${u.name} (${u.username})?`
        const y = confirm(msg)
        if (y) {
            try {
                const ptr = await generatePasswordToken(u.username)
                const host = location.protocol.concat("//").concat(window.location.host);
                await void navigator.clipboard.writeText(host.concat("/pwd?token=").concat(ptr.token));

                alert("Zkopírováno do schránky")
            } catch (e: any) {
                alert(e)
            }
        }
    }

    return (
        <Row>
            <Head>
                <title>Admin - Hřiště Veselice</title>
            </Head>

            <Col md={12}>
                <h2>Rezervace</h2>
                <Table bordered={true}>
                    <thead>
                    <tr>
                        <th>Datum</th>
                        <th>Slot</th>
                        <th>Delka</th>
                        <th>Uzivatel</th>
                        <th>Smazat</th>
                    </tr>
                    </thead>
                    <tbody>
                    {reservations.map(r => {
                        return (
                            <tr key={`${r.date}-${r.slotFrom}`}>
                                <td>{formatDate(r.date)}</td>
                                <td><Clock
                                    slot={r.slotFrom}/> {indexToTime(r.slotFrom)}&nbsp;-&nbsp;{indexToTime(r.slotTo + 1)}
                                </td>
                                <td>{slotsToDuration(r.slotFrom, r.slotTo)}</td>
                                <td>{r.name} ({r.username})</td>
                                <td>
                                    <Button variant={"danger"} onClick={() => onDeleteReservation(r)}>
                                        Smazat
                                    </Button>
                                </td>
                            </tr>
                        )
                    })}

                    </tbody>
                </Table>

                <h2>Uzivatele</h2>
                <Table bordered={true}>
                    <thead>
                    <tr>
                        <th>Jmeno</th>
                        <th>Uzivatelske jmeno</th>
                        <th>Obec</th>
                        <th>Pwd</th>
                        <th>Smazat</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map(u => {
                        return (
                            <tr key={u.username}>
                                <td>{u.name}</td>
                                <td>{u.username}</td>
                                <td>{u.city}</td>
                                <td>
                                    <Button variant={"primary"} onClick={() => onGeneratePasswordToken(u)}>
                                        Pwd token
                                    </Button>
                                </td>
                                <td>
                                    <Button variant={"danger"} onClick={() => onDeleteUser(u)}>
                                        Smazat
                                    </Button>
                                </td>
                            </tr>
                        )
                    })}

                    </tbody>
                </Table>
            </Col>
        </Row>
    );
};

export default Admin;
