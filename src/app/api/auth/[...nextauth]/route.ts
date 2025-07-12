import { authOptions } from "@/lib/helpers/auth-options";
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      id: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
  }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
