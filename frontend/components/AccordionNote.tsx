import React, {FC} from "react";
import {Slot} from "../src/api";

type Props = {
    slot: Slot;
};

export const AccordionNote: FC<Props> = (props: Props) => {

    if (props.slot.note && props.slot.note.length > 0) {
        return (
            <>
                &nbsp;-&nbsp;{props.slot.note.toLowerCase()}
            </>
        )
    }

    return <></>

};
