import NextAuth, { AuthOptions, User as NextAuthUser, Session } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/lib/prisma"
import bcrypt from "bcrypt"
import { User } from "@prisma/client"
import { JWT } from "next-auth/jwt"

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })
        if (!user) {
          return null
        }
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
        if (!isPasswordValid) {
          return null
        }
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: NextAuthUser }) {
      if (user) {
        token.role = (user as User).role
      }
      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session?.user) {
        session.user.role = token.role as "STAFF" | "MANAGER"
      }
      return session
    }
  },
  pages: {
    signIn: "/auth/signin",
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
