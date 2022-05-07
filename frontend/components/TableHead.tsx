import React, {FC} from "react";

// generates 96 slots for day
function getSlots(): number[] {
    return Array(96).fill(0).map((_, i) => i);
}

function slot(h: number): JSX.Element {
    if (h % 4 === 0) {
        return (
            <th colSpan={4}>
                {h / 4}:00
            </th>
        )
    }
    return <></>
}


export const TableHead: FC = () => {
    return (
        <thead>
        <tr>
            <th>&nbsp;</th>
            {getSlots().map(h => {
                return (
                    <React.Fragment key={h}>
                        {slot(h)}
                    </React.Fragment>
                )
            })}
        </tr>
        </thead>
    );
};
