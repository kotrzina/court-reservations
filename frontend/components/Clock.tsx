import {FC} from "react";

type Props = {
    slot: number;
};
export const Clock: FC<Props> = (props: Props) => {

    function convertUnicode(): string {
        let halfDelta = props.slot % 2 === 1 ? 12 : 0

        let s = props.slot / 2
        if (s > 13) {
            s -= 12
        } else if ([0, 1, 12, 13].indexOf(s) > -1) {
            // 12:00 is at the end of array :shrug:
            s = 12
        }


        const code = 128335 + Math.floor(s) + halfDelta
        return "&#" + code.toString() + ";"
    }

    return (
        <span dangerouslySetInnerHTML={{__html: convertUnicode()}}></span>
    );
};
