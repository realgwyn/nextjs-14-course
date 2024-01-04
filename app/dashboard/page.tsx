import {auth} from "@/app/auth";
import {redirect} from "next/navigation";
import {SignOutButton} from "@/components/buttons";
import {prisma} from "@/lib/prisma";
import {ProfileForm} from "@/app/dashboard/ProfileForm";

export default async function Dashboard(){
    const session = await auth();

    if(!session){
        redirect('api/auth/signin')
    }

    const currentUserEmail = session?.user?.email!;
    const user = await prisma.user.findUnique({
        where:{
            email:currentUserEmail
        }
    })

    return (
        <>
            <h1>Dashboard</h1>
            <SignOutButton/>
            <ProfileForm user={user} />
        </>
    );
}
