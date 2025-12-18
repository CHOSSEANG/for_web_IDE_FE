// @/component/layout/Header/index.tsx 
// 헤더 메뉴 로고 + <로그인별 메뉴> + 로그인/회원가입 버튼 + 테마 버튼 

"use client";

import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import PublicMenu from "./PublicMenu";
import AuthMenu from "./AuthMenu";
import IdeMenu from "./IdeMenu";
import Link from "next/link";
import Logo from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";

import { ThemeToggle } from "@/components/ThemeToggle";
import { UserToggle } from "@/components/UserToggle";

export default function Header() {
  const { isSignedIn } = useUser();
  const pathname = usePathname();

  const isIdePage = pathname.startsWith("/app");

  return (
      
    <header className="h-14 flex items-center px-6 border-b border-border-light dark:border-border-light/60">
  {/* 왼쪽 영역: 로고 + 메뉴 */}
  <div className="flex items-center gap-6">
    <Link href="/welcome" className="hover:text-text-primary transition">
      <Logo variant="bar" className="w-15 h-5" />
    </Link>

    {!isSignedIn && <PublicMenu />}
    {isSignedIn && !isIdePage && <AuthMenu />}
    {isSignedIn && isIdePage && <IdeMenu />}
  </div>

  {/* 오른쪽 영역: auth & theme */}
  <div className="ml-auto flex items-center gap-6 [&>header]:border-b-0">
    {!isSignedIn && (
      <>
        <Button asChild>
          <Link
            href="/sign-in"
            className="text-xs px-2 py-2 rounded-md hover:text-text-primary transition">
            로그인
          </Link>
        </Button>
        <Button asChild>
          <Link
            href="/sign-up"
            className="text-xs rounded-md px-2 py-2 hover:bg-bg-raised transition">
            회원가입
          </Link>
        </Button>
      </>
    )}

    <UserToggle />
    <ThemeToggle />
  </div>
</header>
  );
}
