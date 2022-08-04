import React, {FC} from "react";
import {Reservation} from "../src/api";
import {isReservationPublic} from "../src/utils";

type Props = {
    reservation: Reservation;
};
export const ReservationsListHeader: FC<Props> = (props: Props) => {
    if (isReservationPublic(props.reservation) && props.reservation.note) {
        return (
            <>
                📢&nbsp;&nbsp;VEŘEJNÁ UDÁLOST&nbsp;-&nbsp;{props.reservation.note.toLowerCase()}&nbsp;&nbsp;📢<br/>
            </>
        )
    }

    return <></>
};
