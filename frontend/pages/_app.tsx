import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css'
import type {AppProps} from 'next/app'
import Head from "next/head";
import {Container} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {emptyUser, getUserFromStorage, setUserToStorage, User} from "../src/user";
import {UserContext} from "../src/UserContext";
import Menu from "../components/Menu";

function MyApp({Component, pageProps}: AppProps) {

    const [user, setUser] = useState<User>(emptyUser)

    useEffect(() => {
        setUser(getUserFromStorage())
    }, [])

    return (
        <div>
            <Head>
                <title>Rezervacni system</title>
                <meta name="description" content="Rezervační systém"/>
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
                <link rel="manifest" href="/site.webmanifest"/>
                <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5"/>
                <meta name="msapplication-TileColor" content="#da532c"/>
                <meta name="theme-color" content="#ffffff"/>
            </Head>

            <main>

                <Menu user={user} logout={() => {
                    setUserToStorage(emptyUser)
                    location.reload()
                }}/>
                <Container>
                    <UserContext.Provider value={{
                        user: user,
                        login(u: User) {
                            setUser(u)
                            setUserToStorage(u)
                        },
                    }}>
                        <Component {...pageProps} />
                    </UserContext.Provider>
                </Container>
            </main>

            <footer>
                <hr/>

            </footer>
        </div>
    )
}

export default MyApp
