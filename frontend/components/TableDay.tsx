import React, {FC, ReactElement} from "react";
import {Day} from "../src/api";
import {TableSlot} from "./TableSlot";
import {getDayInWeek} from "../src/utils";

type Props = {
    day: Day;
};
export const TableDay: FC<Props> = (props: Props) => {

    function formatDate(dateString: string): ReactElement {
        const d = new Date(dateString)
        const day = d.getDate().toString()
        const month = (d.getMonth() + 1).toString()
        const name = getDayInWeek(dateString)

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
