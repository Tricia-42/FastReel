import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      first_name?: string
      last_name?: string
      locale?: string
    } & DefaultSession["user"]
    firebaseToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    id?: string
  }
} 