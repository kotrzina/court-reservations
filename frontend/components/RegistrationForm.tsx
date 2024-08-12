import {Alert, Button, Form} from "react-bootstrap";
import {useState} from "react";
import {postAlertNotification} from "../src/api";
import {Variant} from "react-bootstrap/types";

const RegistrationForm = () => {

    const [player1, setPlayer1] = useState<string>("")
    const [player2, setPlayer2] = useState<string>("")

    const [flash, setFlash] = useState<string>("Registrace uzavřeny")
    const [flashVariant, setFlashVariant] = useState<Variant>("warning")

    async function onRegister() {
        if (player1.length < 5 || player2.length < 5) {
            setFlashVariant("danger")
            setFlash("Vyplňte hráče")
            return
        }
        const msg = `\`${player1}\` x \`${player2}\``
        try {
            await void postAlertNotification("Tournament registration", msg)
            setFlashVariant("success")
            setFlash("Registrace proběhla úspěšně!")
            setPlayer1("")
            setPlayer2("")
        } catch {
            setFlashVariant("danger")
            setFlash("Chyba serveru")
        }
    }

    return (
        <>
            <h2>Registrace</h2>
            {flash && <Alert variant={flashVariant}>
                {flash}
            </Alert>}
            <Form hidden={true}>
                <Form.Group className="mb-3">
                    <Form.Control
                        min={4}
                        type="text"
                        placeholder="Hráč 1"
                        value={player1}
                        onChange={(e) => setPlayer1(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Control
                        min={4}
                        type="text"
                        placeholder="Hráč 2"
                        value={player2}
                        onChange={(e) => setPlayer2(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Button variant="primary" onClick={() => onRegister()}>Registrovat</Button>
                </Form.Group>
            </Form>
        </>
    );
};

export default RegistrationForm;
