import React, {FC, useContext, useEffect, useState} from "react";
import {UserContext} from "../src/UserContext";
import {Button, Col, Row, Table} from "react-bootstrap";
import {deleteReservation, deleteUser, fetchAllReservations, fetchUsers, Reservation, UserListItem} from "../src/api";
import {useRouter} from "next/router";
import {formatDate, indexToTime, slotsToDuration} from "../src/utils";


const Admin: FC = () => {

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

    return (
        <Row>
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
                                <td>{indexToTime(r.slotFrom)}&nbsp;-&nbsp;{indexToTime(r.slotTo + 1)}</td>
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
                                    <Button variant={"danger"} onClick={() => onDeleteUser(user)}>
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
