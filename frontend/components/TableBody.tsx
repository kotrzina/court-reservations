import React, {FC} from "react";
import {TableDay} from "./TableDay";
import {TimeTable} from "../src/Api";

type Props = {
    table: TimeTable;
};
export const TableBody: FC<Props> = (props: Props) => {
    return (
        <tbody>
        {props.table.timeTable.map(day => {
            return (
                <TableDay key={day.date} day={day}/>
            )
        })}
        </tbody>
    );
};
