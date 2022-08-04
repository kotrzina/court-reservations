import React, {FC, useContext} from "react";
import {Slot} from "../src/api";
import {useRouter} from "next/router";
import {formatDate, getDayInWeek, indexToTime} from "../src/utils";
import {UserContext} from "../src/userContext";
import {Clock} from "./Clock";
import {AccordionNote} from "./AccordionNote";
import {AccordionHeader} from "./AccordionHeader";

type Props = {
    slot: Slot;
};

export const AccordionSlot: FC<Props> = (props: Props) => {

    const router = useRouter()
    const userContext = useContext(UserContext)

    function onSlotClicked() {
        if (userContext.user.logged && props.slot.status === "free") {
            router.push(`/available?date=${props.slot.date}&slot=${props.slot.index}`)
        }
    }

    return (
        <td className={props.slot.status}
            onClick={() => onSlotClicked()}
        >
            <AccordionHeader slot={props.slot}/>
            {getDayInWeek(props.slot.date)}&nbsp;
            {formatDate(props.slot.date)}&nbsp;
            <Clock slot={props.slot.index}/>&nbsp;
            {indexToTime(props.slot.index)}
            <AccordionNote slot={props.slot}/>
        </td>
    )
};
