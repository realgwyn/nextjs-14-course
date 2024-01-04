import {auth} from "@/app/auth";
import {prisma} from "@/lib/prisma";
import {NextResponse} from "next/server";


export async function PUT(req: Request){
    const session = await auth();
    const currentUserEmail = session?.user?.email!;

    const data = await req.json();
    data.age = Number(data.age);

    const user = await prisma.user.update({
        where: {
            email:currentUserEmail,
        },
        data
    });

    return NextResponse.json(user);
}
