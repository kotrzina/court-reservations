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
            router.push(`/available?date=${props.slot.date}&slot=${props.slot.index}`)
        }
    }

    function publicHeader(): JSX.Element {
        if (props.slot.note && props.slot.note.length > 0) {
            return (
                <strong>
                    VEŘEJNÁ UDÁLOST
                    <br/>
                </strong>
            )
        }

        return <></>
    }

    function note(): JSX.Element {
        if (props.slot.note && props.slot.note.length > 0) {
            return (
                <>
                    &nbsp;-&nbsp;{props.slot.note.toLowerCase()}
                </>
            )
        }

        return <></>
    }

    return (
        <td className={props.slot.status}
            onClick={() => onSlotClicked()}
        >
            {publicHeader()}
            {getDayInWeek(props.slot.date)}&nbsp;
            {formatDate(props.slot.date)}&nbsp;
            <Clock slot={props.slot.index}/>&nbsp;
            {indexToTime(props.slot.index)}
            {note()}
        </td>
    )
};
