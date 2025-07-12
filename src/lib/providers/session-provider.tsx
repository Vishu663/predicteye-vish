"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

interface AuthContextProps {
  children: React.ReactNode;
}

const SessionProvider = ({ children }: AuthContextProps) => {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
};

export default SessionProvider;
