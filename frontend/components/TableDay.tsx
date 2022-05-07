import React, {FC} from "react";
import {Day} from "../src/api";
import {TableSlot} from "./TableSlot";

type Props = {
    day: Day;
};
export const TableDay: FC<Props> = (props: Props) => {

    const days = [
        "ne",
        "po",
        "út",
        "st",
        "čt",
        "pá",
        "so",
    ]

    function formatDate(dateString: string): JSX.Element {
        const d = new Date(dateString)
        const day = d.getDate().toString()
        const month = (d.getMonth() + 1).toString()
        const name = days[d.getDay()]

        return (
            <>{name}&nbsp;{day}.&nbsp;{month}.</>
        )
    }

    return (
        <tr>
            <td className={"dateCell"}>{formatDate(props.day.date)}</td>
            {props.day.slots.map(slot => {
                return (
                    <TableSlot key={slot.index} slot={slot}/>
                )
            })}
        </tr>
    );
};
