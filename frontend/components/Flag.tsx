type Props = {
    nation: string;
};

export const Flag = (props: Props) => {

    const flagMap: { [key: string]: string } = {
        "cze": "/flags/cze.png",
        "ger": "/flags/ger.png",
    }

    return (
        <img
            src={flagMap[props.nation]}
            width={25}
            alt={"flag"}
        />
    );
};
