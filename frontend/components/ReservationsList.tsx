import React, {FC} from "react";
import {ReservationItem} from "../src/api";
import {Badge, ListGroup} from "react-bootstrap";
import {formatDate, indexToTime, slotsToDuration} from "../src/utils";

type Props = {
    title: string;
    reservations: ReservationItem[];
};
export const ReservationsList: FC<Props> = (props: Props) => {

    function title(): JSX.Element {
        if (props.reservations.length > 0) {
            return (
                <h3>{props.title}</h3>
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
                        key={`${r.date}-${r.slotFrom}`}
                    >
                        <div className="ms-2 me-auto">
                            <div className="fw-bold">
                                {formatDate(r.date)} 🕜 {indexToTime(r.slotFrom)} - {indexToTime(r.slotTo + 1)}
                            </div>
                            {r.owner}
                        </div>
                        <Badge bg="success" pill>
                            {slotsToDuration(r.slotFrom, r.slotTo)}
                        </Badge>
                    </ListGroup.Item>
                )
            })}
        </ListGroup>
    );
};
