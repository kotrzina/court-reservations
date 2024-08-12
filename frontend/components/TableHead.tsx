import React, {FC, ReactElement} from "react";
import {TimeTable} from "../src/api";

function slot(h: number): ReactElement {
    if (h % 2 === 0) {
        return (
            <th colSpan={2}>
                {h / 2}:00
            </th>
        )
    }
    return <></>
}

type Props = {
    table: TimeTable;
};

export const TableHead: FC<Props> = (props: Props) => {
    return (
        <thead>
        <tr>
            <th>&nbsp;</th>
            {props.table.timeTable[0]?.slots.map((s) => {
                return (
                    <React.Fragment key={s.index}>
                        {slot(s.index)}
                    </React.Fragment>
                )
            })}
        </tr>
        </thead>
    );
};
