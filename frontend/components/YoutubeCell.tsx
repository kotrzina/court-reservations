import {FaYoutube} from "react-icons/fa";
import {FC} from "react";

type Props = {
    video: string;
};

export const YoutubeCell: FC<Props> = (props: Props) => {

    return (
        <td style={{padding: 0, margin: 0, verticalAlign: "middle", textAlign: "center"}}>
            <a title={"Youtube video"} href={props.video} target={"_blank"}>
                <FaYoutube size={24} color={"#FF0000"}/>
            </a>
        </td>
    );

};
