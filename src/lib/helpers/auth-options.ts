import { AuthProvider } from "@prisma/client";
import bcrypt from "bcryptjs";
import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import prisma from "../config/prisma";
import { env } from "../env";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        // Find the user in the database
        let dbUser = await prisma.user.findUnique({
          where: {
            email: user.email as string,
          },
        });

        if (!dbUser) {
          // Create a new user if it doesn't exist
          dbUser = await prisma.user.create({
            data: {
              email: user.email as string,
              name: user.name as string,
              image:
                (user.image as string) || "/placeholder.svg?height=50&width=50",
              provider:
                account?.provider === "google"
                  ? AuthProvider.Google
                  : AuthProvider.Local,
            },
          });
        } else {
          // Update the provider if the user signs in with a different method
          const newProvider =
            account?.provider === "google"
              ? AuthProvider.Google
              : AuthProvider.Local;

          if (dbUser.provider !== newProvider) {
            await prisma.user.update({
              where: { id: dbUser.id },
              data: { provider: newProvider },
            });
          }
        }

        // Add user details to the token
        token = { ...token, id: dbUser.id, role: dbUser.role };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: { ...session.user, id: token.id, role: token.role },
      };
    },
  },
  secret: env.NEXTAUTH_SECRET,
};
