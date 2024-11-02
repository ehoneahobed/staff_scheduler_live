import { JWT as NextAuthJWT } from "next-auth/jwt"
import { Session as NextAuthSession } from "next-auth"

declare module "next-auth" {
  interface User {
    role: "STAFF" | "MANAGER"
  }
  interface Session extends NextAuthSession {
    user: User & {
      role: "STAFF" | "MANAGER"
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT extends NextAuthJWT {
    role?: "STAFF" | "MANAGER"
  }
}
