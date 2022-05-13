import React, {FC, useContext} from "react";
import {Slot} from "../src/api";
import {useRouter} from "next/router";
import {formatDate, getDayInWeek, indexToTime} from "../src/utils";
import {UserContext} from "../src/UserContext";
import {Clock} from "./Clock";

type Props = {
    slot: Slot;
};

export const AccordionSlot: FC<Props> = (props: Props) => {

    const router = useRouter()
    const userContext = useContext(UserContext)

    function onSlotClicked() {
        if (userContext.user.logged && props.slot.status === "free") {
            router.push(`/available/${props.slot.date}/${props.slot.index}`)
        }
    }

    return (
        <td className={props.slot.status}
            onClick={() => onSlotClicked()}
        >
            {getDayInWeek(props.slot.date)} {formatDate(props.slot.date)} <Clock slot={props.slot.index}/> {indexToTime(props.slot.index)}
        </td>
    )
};
