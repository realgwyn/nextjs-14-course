import NextAuth from "next-auth"
import GithubProvider from 'next-auth/providers/github';
import {PrismaAdapter} from "@auth/prisma-adapter";
import {PrismaClient} from "@prisma/client";

export const prisma = new PrismaClient();

export const authOptions  = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
    ],
    adapter: PrismaAdapter(prisma),
};

export const { handlers: { GET, POST }, auth,} = NextAuth(authOptions);
