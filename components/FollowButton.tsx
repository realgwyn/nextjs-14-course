import {auth} from "@/app/auth";
import {prisma} from "@/lib/prisma";
import FollowClient from "@/components/FollowClient";

interface Props {
    targetUserId: string;
}

export default async function FollowButton({targetUserId} : Props){
    const session = await auth();

    if(!session){
        return <></>
    }

    const currentUserId = await prisma.user
        .findUnique({where: { email: session?.user?.email!}})
        .then((user) => user?.id!);

    const isFollowing = await prisma.follows.findFirst({
       where: { followerId: currentUserId, followingId: targetUserId}
    });

    return (
        <FollowClient targetUserId={targetUserId} isFollowing={!!isFollowing}/>
    );

}
