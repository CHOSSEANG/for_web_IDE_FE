"use client";

import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import PublicMenu from "./PublicMenu";
import AuthMenu from "./AuthMenu";
import IdeMenu from "./IdeMenu";
import Link from "next/link";
import Logo from "@/components/brand/Logo";

export default function Header() {
  const { isSignedIn } = useUser();
  const pathname = usePathname();

  const isIdePage = pathname.startsWith("/app");

  return (
    <header className="h-14 flex items-center px-6 border-b border-border-light dark:border-border-light/60">
      {/* 로고 */}
      <div className="font-bold">
        <Link href="/welcome" className="hover:text-text-primary transition">
          <Logo variant="bar" className="w-15 h-5" />
        </Link>
      </div>

      <div className="ml-auto">
        {!isSignedIn && <PublicMenu />}

        {isSignedIn && !isIdePage && <AuthMenu />}

        {isSignedIn && isIdePage && <IdeMenu />}
      </div>
    </header>
  );
}
