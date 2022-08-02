import React, {FC, useContext} from "react";
import {deleteReservation, Reservation} from "../src/api";
import {Badge, ListGroup} from "react-bootstrap";
import {formatDate, getDayInWeek, indexToTime} from "../src/utils";
import {UserContext} from "../src/userContext";
import {FlashVariant} from "./Flash";
import {Clock} from "./Clock";

type Props = {
    title: string;
    reservations: Reservation[];
    setFlash(variant: FlashVariant, message: string): void;
    reload(): void;
};
export const ReservationsList: FC<Props> = (props: Props) => {

    const {user} = useContext(UserContext)

    function title(): JSX.Element {
        if (props.reservations.length > 0) {
            return (
                <h3>{props.title}</h3>
            )
        }

        return <></>
    }

    function onDelete(r: Reservation) {
        const y = confirm(`Opravdu chcete smazat rezervaci ${getDayInWeek(r.date)} ${formatDate(r.date)} - ${indexToTime(r.slotFrom)}-${indexToTime(r.slotTo + 1)}`)
        if (y) {
            deleteReservation(r.date, r.slotFrom).then(() => {
                props.reload()
                props.setFlash("ok", "Rezervace smazána.")
                window.scrollTo(0, 0)
            }).catch(() => {
                props.setFlash("error", "Rezervaci nelze smazat.")
            })
        }
    }

    function deleteBadge(r: Reservation): JSX.Element {
        if (user.username === r.username) {
            return (
                <Badge bg="danger" pill style={{cursor: "pointer"}} onClick={() => {
                    onDelete(r)
                }}>
                    ×
                </Badge>
            )

        }

        return (
            <></>
        )
    }

    function isReservationPublic(r: Reservation): boolean {
        return !!(r.note && r.note.length > 0);
    }

    function publicHeader(r: Reservation): JSX.Element {
        if (r.note && isReservationPublic(r)) {
            return (
                <>
                    📢&nbsp;&nbsp;VEŘEJNÁ UDÁLOST&nbsp;-&nbsp;{r.note.toLowerCase()}&nbsp;&nbsp;📢<br/>
                </>
            )
        }

        return <></>
    }

    return (
        <ListGroup as="ul">
            {title()}
            {props.reservations.map(r => {
                return (
                    <ListGroup.Item
                        as="li"
                        className="d-flex justify-content-between align-items-start"
                        style={{backgroundColor: isReservationPublic(r) ? "#fcf4dc" : "inherit"}}
                        key={`${r.date}-${r.slotFrom}`}
                    >
                        <div className="ms-2 me-auto">
                            <div className="fw-bold">
                                {publicHeader(r)}
                                {formatDate(r.date)}&nbsp;
                                <Clock slot={r.slotFrom}/>&nbsp;
                                {indexToTime(r.slotFrom)}&nbsp;-&nbsp;
                                {indexToTime(r.slotTo + 1)}

                            </div>
                            {r.name}
                        </div>
                        {deleteBadge(r)}
                    </ListGroup.Item>
                )
            })}
        </ListGroup>
    );
};
