import {Alert, Button, Col, Row} from "react-bootstrap";
import {Variant} from "react-bootstrap/types";
import {useRouter} from "next/router";
import React, {FC} from "react";

type Props = {
    variant: Variant;
    title: string;
    linkTitle: string;
    linkPage: string;
    children?: React.ReactNode;
};

const AlertBanner: FC<Props> = (props: Props) => {

    const router = useRouter()

    return (
        <Row>

            <Col md={12}>
                <Alert variant={props.variant}>
                    <Alert.Heading>{props.title}</Alert.Heading>
                    {props.children && <p>
                        {props.children}
                    </p>}
                    <hr/>
                    <div className="d-flex">
                        <Button variant={props.variant} onClick={() => {
                            void router.push(props.linkPage)
                        }}>
                            {props.linkTitle}
                        </Button>
                    </div>
                </Alert>
            </Col>
        </Row>
    );
};

export default AlertBanner;
