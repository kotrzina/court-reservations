import React, {FC, useContext} from "react";
import {Reservation} from "../src/api";
import {Badge} from "react-bootstrap";
import {UserContext} from "../src/userContext";

type Props = {
    reservation: Reservation;
    deleteReservation(r: Reservation): void;
};
export const ReservationsListDeleteBadge: FC<Props> = (props: Props) => {

    const {user} = useContext(UserContext)

    if (user.username === props.reservation.username) {
        return (
            <Badge bg="danger" pill style={{cursor: "pointer"}} onClick={() => {
                props.deleteReservation(props.reservation)
            }}>
                ×
            </Badge>
        )

    }

    return (
        <></>
    )
};
