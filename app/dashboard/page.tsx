import {auth} from "@/app/auth";
import {redirect} from "next/navigation";
import {SignOutButton} from "@/components/buttons";

export default async function Dashboard(){
    const session = await auth();

    if(!session){
        redirect('api/auth/signin')
    }

    return (
        <>
            <h1>Dashboard</h1>
            <SignOutButton/>
        </>
    );
}
