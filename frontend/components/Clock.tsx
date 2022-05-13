import {FC} from "react";

type Props = {
    slot: number;
};
export const Clock: FC<Props> = (props: Props) => {

    function convertUnicode(): string {
        let s = props.slot / 2
        if (s > 12) {
            s -= 12
        } else if (s === 0 || s === 12) {
            s = 12
        }

        const halfDelta = props.slot % 2 === 1 ? 12 : 0
        const code = 128335 + Math.floor(s) + halfDelta

        return "&#" + code.toString() + ";"
    }

    return (
        <span dangerouslySetInnerHTML={{__html: convertUnicode()}}></span>
    );
};
