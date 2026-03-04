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

                return { id: user.id, name: user.name ?? user.username, email: user.email ?? user.username, role: 'ADMIN' }
            }
        }),
        Credentials({
            name: "User Login",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                const email = credentials.email as string
                const password = credentials.password as string

                const user = await prisma.user.findUnique({
                    where: { email }
                })

                if (!user || !user.password || user.provider !== 'local') {
                    // Only allow 'local' provider users to log in with password
                    return null
                }

                const isValid = await bcrypt.compare(password, user.password)

                if (!isValid) {
                    return null
                }

                return { id: user.id, name: user.name, email: user.email, role: 'USER' }
            }
        }),
        // Naver, Kakao, Google Providers
        Naver({ clientId: process.env.NAVER_CLIENT_ID, clientSecret: process.env.NAVER_CLIENT_SECRET }),
        Kakao({ clientId: process.env.KAKAO_CLIENT_ID, clientSecret: process.env.KAKAO_CLIENT_SECRET }),
        Google({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            // When a user signs in via OAuth, ensure the provider field is accurate
            if (account && account.provider !== "credentials" && user.email) {
                await prisma.user.update({
                    where: { email: user.email },
                    data: { provider: account.provider },
                });
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role || 'USER';
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).role = token.role;
            }
            return session;
        }
    }
})
