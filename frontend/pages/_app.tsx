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
                <link rel="icon" href="/favicon.ico"/>
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
