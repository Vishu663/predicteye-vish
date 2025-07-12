"use client";

import SessionProvider from "./session-provider";
import { ThemeProvider } from "./theme-provider";
import ToasterProvider from "./toast-provider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ToasterProvider />
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
};

export default Providers;
