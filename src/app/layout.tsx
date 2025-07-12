import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Header from "@/components/common/page-header";
import Providers from "@/lib/providers";
import NextTopLoader from "nextjs-toploader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Predictye",
  description:
    "Get accurate resale value predictions for furniture and jewelry using AI-powered insights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.jpeg" />
      </head>
      <body className={inter.className}>
        <Providers>
          <NextTopLoader showSpinner={false} color="#ff0000" />
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
