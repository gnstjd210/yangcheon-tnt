import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import Naver from "next-auth/providers/naver"
import Kakao from "next-auth/providers/kakao"
import Google from "next-auth/providers/google"
import { authConfig } from "./auth.config"

import prisma from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    providers: [
        Credentials({
            name: "Admin Login",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    return null
                }

                const username = credentials.username as string
                const password = credentials.password as string

                const user = await prisma.user.findUnique({
                    where: { username }
                })

                if (!user || !user.password) {
                    return null
                }

                const isValid = await bcrypt.compare(password, user.password)

                if (!isValid) {
                    return null
                }

                return { id: user.id, name: user.username, email: user.username }
            }
        }),
        // Naver, Kakao, Google Providers
        Naver({ clientId: process.env.NAVER_CLIENT_ID, clientSecret: process.env.NAVER_CLIENT_SECRET }),
        Kakao({ clientId: process.env.KAKAO_CLIENT_ID, clientSecret: process.env.KAKAO_CLIENT_SECRET }),
        Google({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET }),
    ],
})
