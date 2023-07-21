import {Flag} from "./Flag";

export type Player = {
    name: string;
    nation: string;
}

type Props = {
    single?: Player[];
    double?: [Player, Player][];
};

export const RegisteredPlayer = (props: Props) => {
    if (props.double) {
        return (
            <>
                <h2>Registrované páry</h2>
                <ul style={{listStyle: "none", paddingLeft: 0}}>
                    {props.double.map((p, i) => {
                        return (
                            <li key={p[0].name}>
                                {i+1}.&nbsp;
                                <Flag nation={p[0].nation}/> {p[0].name}
                                &nbsp;&nbsp;<strong>×</strong>&nbsp;&nbsp;
                                <Flag nation={p[1].nation}/> {p[1].name}
                            </li>
                        )
                    })}
                </ul>

            </>
        );
    }

    return (
        <></> // todo single
    )
};


