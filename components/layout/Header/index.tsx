"use client";

import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import PublicMenu from "./PublicMenu";
import AuthMenu from "./AuthMenu";
import IdeMenu from "./IdeMenu";

export default function Header() {
  const { isSignedIn } = useUser();
  const pathname = usePathname();

  const isIdePage = pathname.startsWith("/app");

  return (
    <header className="h-14 flex items-center px-6 border-b">
      {/* 로고 */}
      <div className="font-bold">WebIC</div>

      <div className="ml-auto">
        {!isSignedIn && <PublicMenu />}

        {isSignedIn && !isIdePage && <AuthMenu />}

        {isSignedIn && isIdePage && <IdeMenu />}
      </div>
    </header>
  );
}
