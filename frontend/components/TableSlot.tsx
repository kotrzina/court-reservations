import React, {FC} from "react";
import {Slot} from "../src/Api";
import {useRouter} from "next/router";
import {indexToTime} from "../src/utils";

type Props = {
    slot: Slot;
};

export const TableSlot: FC<Props> = (props: Props) => {

    const router = useRouter()

    function onSlotClicked() {
        if (props.slot.status === "free") {
            router.push(`/available/${props.slot.date}/${props.slot.index}`)
        }
    }

    return (
        <td title={indexToTime(props.slot.index)} className={props.slot.status} onClick={() => onSlotClicked()}></td>
    )
};
