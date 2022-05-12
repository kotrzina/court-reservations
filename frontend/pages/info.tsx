import {Col, Row} from "react-bootstrap";
import {NextPage} from "next";
import Link from "next/link";

const Info: NextPage = () => {

    return (
        <Row>
            <Col md={12}>
                <h1>Informace</h1>
                <p>
                    <strong>
                        Rezervační systém vznikl za účelem zefektivnění využitelnosti našeho hřiště. Rozhodně
                        není jeho účelem nějak zvýhodňovat určitou skupinu uživatelů.
                    </strong>
                </p>
                <p>
                    Asi si dokážete přestavit, že se s někým domluvíte třeba na tenis na určitou hodinu a na místě se
                    sejdete. Kurt však bude obsazený a vám nezbude nic jiného než čekat. Tento rezervační systém
                    by měl tento problém řešit. Bohužel nejde nijak vymáhat, aby lidé striktně dodržovali kalendář.
                    Ale doufáme, že lidé budou i ve svém vlastním zájmu tyto &ldquo;pravidla&ldquo; dodržovat.
                </p>

                <h3>Registrace</h3>
                <p>
                    <Link href={"/register"}>Zaregistrovat</Link> se může <strong>kdokoliv</strong>, kdo
                    zná <strong>&ldquo;tajný kód&ldquo;</strong>. Ten můžete najít na cedulce při vstupu na hřiště.
                    Tento tajný kód má zabránit registraci zcela náhodných lidi. Dále je nutné zadat svoje přihlašovací
                    údaje (uživatelské jméno a heslo). Také je nutné uvést vaše celé jméno a obec. Vyhrazujeme si právo
                    uživatele smazat, pokud jméno nebo obec bude smyšlené nebo nebude možné uživatele identifikovat.
                    Hřiště ve Veselici by mělo primárně sloužit lidem z Veselice a blízkého okolí. To je důvodem těchto
                    opatření.
                </p>

                <h3>Přihlášení</h3>
                <p>
                    Po úspěšné registraci se rovnou můžete <Link href={"/login"}>přihlásit</Link> pomocí zvoleného
                    uživatelského jména a hesla. A je to! Můžete rezervovat.
                </p>

                <h3>Pravidla rezervace</h3>
                <ol>
                    <li>Rezervace je možná jen od 6:00 do 22:00</li>
                    <li>Maximální doba rezervace je 2 hodiny</li>
                    <li>Osoba by měla provést maximálně jednu rezervaci za jeden den (pravidlo není vynuceno rezervačním
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

                <ul>
                    <li><span style={{color: "#176910", fontSize: "140%"}}>■</span> - volný interval</li>
                    <li><span style={{color: "#751222", fontSize: "140%"}}>■</span> - obsazeno</li>
                    <li><span style={{color: "#555", fontSize: "140%"}}>■</span> - údržba / delší akce</li>
                </ul>

                <h3>Storno rezervace</h3>
                <p>
                    Na hlavní stránce můžete vidět svůj seznam rezervací. Zrušit ji můžete pomocí červeného křížku v
                    pravém horním rohu. Pokud víte, že svoji rezervaci nevyužiteje, zrušte ji prosím co nejdříve, aby se
                    termín uvolnil dalším potencionální uživatelům.
                </p>

                <h3>Problémy:</h3>
                <p>
                    Pokud budete mít s aplikací jakékoliv problémy (technické, zapomenuté heslo) prosím kontaktujte
                    Tomáše Kozáka (tel. 730996957, email: kozak@talko.cz). To platí také pro návrhy úprav a vylepšení.
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

                <h3>Bezpečnost aplikace:</h3>
                <p>
                    Všechny vaše údaje včetně přihlašovacího hesla jsou bezpečně uloženy. Databázi a aplikační servery
                    provozuje společnost Google. Technické detaily:
                </p>
                <ul>
                    <li>Frontend - CloudFlare pages</li>
                    <li>Backend - Google Cloud Run</li>
                    <li>Databáze - Google Firestore</li>
                    <li>Hesla jsou ukládány pomocí hashovací funkce bcrypt s cenou 14</li>
                    <li>Přihlašovací session je implementovaná pomocí JWT tokenu s podpisovou metodou HS256</li>
                </ul>

                <h3>Otevřený zdrojový kód:</h3>
                <p>
                    Kompletní zdrojové kódy aplikace jsou k dispozici na <a
                    href={"https://github.com/kotrzina/court-reservations"}
                    rel={"noreferrer"}
                    target={"_blank"}
                >https://github.com/kotrzina/court-reservations</a> pod
                    WTFPL licencí. Pull requesty jsou vítány.
                </p>
            </Col>
        </Row>
    )
};

export default Info;
