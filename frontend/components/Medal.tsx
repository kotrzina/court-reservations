type Props = {
    type: "gold" | "silver" | "bronze";
};

export const Medal = (props: Props) => {
    return (
        <img width={"16px"} height={"16px"} src={`/${props.type}.png`} alt={`${props.type} medal`}/>
    );
};

export default Medal;
