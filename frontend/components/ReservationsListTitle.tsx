import React, {FC} from "react";

type Props = {
    title: string;
    display: boolean;
};

export const ReservationsListTitle: FC<Props> = (props: Props) => {

    if (props.display) {
        return (
            <h3>{props.title}</h3>
        )
    }

    return <></>

};
