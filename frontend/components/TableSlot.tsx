import React, {FC, useContext} from "react";
import {Slot} from "../src/api";
import {useRouter} from "next/router";
import {indexToTime} from "../src/utils";
import {UserContext} from "../src/userContext";

type Props = {
    slot: Slot;
};

export const TableSlot: FC<Props> = (props: Props) => {
    const router = useRouter()
    const userContext = useContext(UserContext)

    function title(): string {
        let title = indexToTime(props.slot.index) + " - " + indexToTime(props.slot.index + 1)
        if (props.slot.owner) {
            title += ` ${props.slot.owner}`
        }
        if (props.slot.note && props.slot.note.length > 0) {
            title += ` - ${props.slot.note.toLowerCase()}`
        }

        return title
    }

    function onSlotClicked() {
        if (userContext.user.logged && props.slot.status === "free") {
            router.push(`/available?date=${props.slot.date}&slot=${props.slot.index}`)
        }
    }

    return (
        <td title={title()} className={props.slot.status} onClick={() => onSlotClicked()}></td>
    )
};
