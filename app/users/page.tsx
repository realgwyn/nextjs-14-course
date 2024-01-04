import {prisma} from "@/lib/prisma";
import UserCard from "@/components/UserCard";

export const dynamic = 'force-dynamic'

export default async function Users() {
    const users = await prisma.user.findMany();

    return (
        <div>
            {users.map((user: any) => {
                return <UserCard key={user.id} {...user} />;
            })}
        </div>
    );

}
