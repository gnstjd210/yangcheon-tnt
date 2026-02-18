import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: '/admin/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isOnAdmin = nextUrl.pathname.startsWith('/admin')
            const isOnLogin = nextUrl.pathname.startsWith('/admin/login')

            if (isOnAdmin && !isOnLogin) {
                if (isLoggedIn) return true
                return false // Redirect unauthenticated users to login page
            }

            if (isOnLogin) {
                if (isLoggedIn) {
                    return Response.redirect(new URL('/admin', nextUrl))
                }
                return true
            }

            return true
        },
        async session({ session, token }) {
            if (token?.sub && session.user) {
                session.user.name = token.name
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token.name = user.name
            }
            return token
        }
    },
    providers: [], // Configured in auth.ts
} satisfies NextAuthConfig
