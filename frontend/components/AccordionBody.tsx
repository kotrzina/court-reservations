import React, {FC} from "react";
import {TimeTable} from "../src/api";
import {Accordion, Table} from "react-bootstrap";
import {AccordionDay} from "./AccordionDay";

type Props = {
    table: TimeTable;
};
export const AccordionBody: FC<Props> = (props: Props) => {
    return (
        <Accordion>
            {props.table.timeTable.map(d => {
                return (
                    <AccordionDay day={d}/>
                )
            })}
        </Accordion>
    );
};
