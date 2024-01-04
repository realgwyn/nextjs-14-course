import Image from 'next/image'
import styles from './page.module.css'
import {auth} from "@/app/auth";

export default async function Home() {

    const session = await auth();
    let message = "Hello Stranger";
    console.log("session: " + session)
    if(session){
        message = `Hello ${session?.user.name}`
    }

    return (
        <main>
            {message}
        </main>
    )
}
