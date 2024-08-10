import {NextPage} from "next";
import {useRouter} from "next/router";
import {useEffect} from "react";

const Single2024: NextPage = () => {

    const router = useRouter()

    useEffect(() => {
        // temporary redirect
        // could be deleted after the tournament is over
        router.push("/turnaj/2024-singl")
    })

    return (
        <></>
    )
};

export default Single2024;
