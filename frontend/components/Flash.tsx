import {FC} from "react";
import {Alert, Col, Row} from "react-bootstrap";
import {Variant} from "react-bootstrap/types";

export type FlashVariant = "ok" | "error"

export type FlashType = {
    display: boolean
    type: FlashVariant
    message: string
}

type Props = {
    flash: FlashType
};

export const Flash: FC<Props> = (props: Props) => {

    function resolveVariant(type: FlashVariant): Variant {
        if (type === "ok") {
            return "success"
        }

        return "danger"
    }

    return (
        <Row>
            <Col md={12}>
                <Alert hidden={!props.flash.display} variant={resolveVariant(props.flash.type)}>
                    {props.flash.message}
                </Alert>
            </Col>
        </Row>
    );
};

