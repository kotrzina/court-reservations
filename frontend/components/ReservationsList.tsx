import React, {FC} from "react";
import {deleteReservation, Reservation} from "../src/api";
import {ListGroup} from "react-bootstrap";
import {formatDate, getDayInWeek, indexToTime, isReservationPublic} from "../src/utils";
import {FlashVariant} from "./Flash";
import {Clock} from "./Clock";
import {ReservationsListHeader} from "./ReservationsListHeader";
import {ReservationsListDeleteBadge} from "./ReservationsListDeleteBadge";
import {ReservationsListTitle} from "./ReservationsListTitle";

type Props = {
    title: string;
    reservations: Reservation[];
    // @ts-ignore
    setFlash(_variant: FlashVariant, _message: string): void;
    reload(): void;
};

export const ReservationsList: FC<Props> = (props: Props) => {

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

    return (
        <ListGroup as="ul" hidden={props.reservations.length === 0}>
            <ReservationsListTitle title={props.title} display={props.reservations.length > 0}/>
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
                                <ReservationsListHeader reservation={r}/>
                                {formatDate(r.date)}&nbsp;
                                <Clock slot={r.slotFrom}/>&nbsp;
                                {indexToTime(r.slotFrom)}&nbsp;-&nbsp;
                                {indexToTime(r.slotTo + 1)}

                            </div>
                            {r.name}
                        </div>
                        <ReservationsListDeleteBadge reservation={r} deleteReservation={onDelete}/>
                    </ListGroup.Item>
                )
            })}
        </ListGroup>
    );
};
