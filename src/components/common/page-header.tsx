"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="h-[8svh] border-b">
      <div className="flex items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-x-2 text-lg font-bold lg:text-xl"
        >
          <Image src="/logo.jpeg" alt="Predictye" width={30} height={30} />
          Predictye
        </Link>
        <div className="flex items-center gap-4">
          <ModeToggle />

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  {session.user?.name?.charAt(0).toUpperCase()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Link href={"/products"} className="cursor-pointer">
                  <DropdownMenuItem>Saved Product(s)</DropdownMenuItem>
                </Link>
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex">
              <Link href="/login">
                <Button
                  variant="outline"
                  className=" rounded-l-md rounded-r-none"
                >
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  variant="default"
                  className="rounded-l-none rounded-r-md"
                >
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
