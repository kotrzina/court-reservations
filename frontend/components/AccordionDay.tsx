import React, {FC} from "react";
import {Day} from "../src/api";
import {Accordion, Table} from "react-bootstrap";
import {formatDate, getDayInWeek} from "../src/utils";
import {AccordionSlot} from "./AccordionSlot";

type Props = {
    day: Day;
};
export const AccordionDay: FC<Props> = (props: Props) => {
    return (
        <Accordion.Item eventKey={props.day.date}>
            <Accordion.Header>
                {getDayInWeek(props.day.date)} {formatDate(props.day.date)}
            </Accordion.Header>
            <Accordion.Body>
                <Table className={"accordionView"}>
                    <tbody>
                    {props.day.slots.map(s => {
                        return (
                            <tr key={s.index}>
                                <AccordionSlot slot={s}/>
                            </tr>
                        )
                    })}
                    </tbody>
                </Table>
            </Accordion.Body>
        </Accordion.Item>
    );
};
