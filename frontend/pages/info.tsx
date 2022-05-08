import {Col, Row} from "react-bootstrap";
import {NextPage} from "next";
import Link from "next/link";

const Login: NextPage = () => {

    return (
        <Row>
            <Col md={12}>
                <h1>Informace</h1>
                <p>
                    <strong>
                        Rezervační systém vzniknul za účelem zefektivnění využitelnosti našeho hřiště. Rozhodně
                        není jeho účelem nějak zvýhoďnovat určitou skupinu uživatelů.
                    </strong>
                </p>
                <p>
                    Asi si dokážete přestavit, že se s někým domluvíte třeba na tenis na určitou hodinu a na místě se
                    sejdete. Kurt však bude obsazený a vám nezbude nic jiného než čekat. Právě tento rezervační systém
                    by měl tento problém vyřešit. Bohužel nejde nijak vymáhat, aby lidé striktně dodržovali kalendář,
                    ale doufáme, že lidé budou i ve svém vlastím zájmu tyto "pravidla" dodržovat.
                </p>

                <h3>Registrace</h3>
                <p>
                    <Link href={"/register"}>Zaregistrovat</Link> se může <strong>kdokoliv</strong>, kdo zná <strong>"tajný
                    kód"</strong>. Ten můžete
                    najít na cedulce při vstupu na hřiště. Tento tajný kód má zabránit registraci zcela náhodných lidi.
                    Dále je nutné zadat svoje přihlašovací údaje (uživatelské jméno a heslo). Také je nutné uvést
                    vaše celé jméno
                    a obec. Vyhrazujeme si právo uživatele smazat, pokud jméno nebo obec bude smyšlené nebo nebude možné
                    uživatele identifikovat. Hřiště ve Veselici by mělo primárně sloužit lidem z Veselice a blízkého
                    okolí. To je důvodem těchto opatření.
                </p>

                <h3>Přihlášení</h3>
                <p>
                    Po úspěšné registraci se rovnou můžete <Link href={"/login"}>přihlásit</Link> pomocí zvoleného
                    uživatelského jména a hesla. A je to! Můžete rezervovat.
                </p>

                <h3>Pravidla rezervace</h3>
                <ol>
                    <li>Maximální doba rezervace je 2 hodiny</li>
                    <li>Osoba by měla provést maximálně jedu rezervaci za jeden den (pravidlo není vynuceno rezervačním
                        systémem)
                    </li>
                    <li>Osoba je povinna rezervaci využít, popř. rezervaci zrušit</li>
                </ol>
                <p>
                    Rezervace jsou rozděleny do 30minutových intervalů. Podle barvy intervalu v rezervační tabulce
                    můžete zjistit, zda je na hřišti volno nebo zda je obsazeno. Po kliknutí na volný interval se vám
                    otevře nabídka s možnostmi rezervace. Pak už stačí jen vybrat požadovanou délku a kliknout na
                    tlačítko rezervovat.
                </p>

                <h3>Storno rezervace</h3>
                <p>
                    Na hlavní stránce můžete vidět svůj seznam rezervací. Zrušit ji můžete pomocí červeného křížku v
                    pravém horním rohu. Pokud víte, že svoji rezervaci nevyužiteje, zrušte ji prosím co nejdříve, aby se
                    termín uvolnil dalším potencionální uživatelům.
                </p>

                <h3>Podmínky registrace/rezervace:</h3>
                <p>
                    Provozovatelem rezervačního systému je SH ČMS - Sbor dobrovolných hasičů Veselice (IČ: 65339851).
                    Vyplněním a odesláním registračního formuláře dává uživatel spol. SH ČMS - Sbor dobrovolných hasičů
                    Veselice (IČ: 65339851) souhlas se zpracováním a využitím údajů o své osobě pro účely provozu
                    rezervačního systému v souladu s příslušnými ustanoveními zákona č. 101/2000 Sb. (zákon o ochraně
                    osobních údajů) v platném znění. Údaje jsou uživatelem poskytovány dobrovolně a svůj souhlas s
                    jejich zpracováním může kdykoliv písemně odvolat na adrese sídla.
                </p>

            </Col>
        </Row>
    );
};

export default Login;
