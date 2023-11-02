"use client";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import { ModeToggle } from "./ModeToggle";
import AuthMenu from "./AuthMenu";
import Options from "./Options";

type Props = {};

function Navbar({}: Props) {
  const { data: session } = useSession();
  return (
    <nav className="sticky top-0 w-full p-4 z-50 shadow-md flex items-center justify-between border dark:shadow-slate-500">
      <Link href={"/"}>
        <Button>Home</Button>
      </Link>
      <div className="flex items-center gap-x-3">
        <ModeToggle />
        {session ? <Options session={session} /> : <AuthMenu />}
      </div>
    </nav>
  );
}

export default Navbar;
