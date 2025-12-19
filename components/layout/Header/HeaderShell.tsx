// components/layout/Header/HeaderShell.tsx
"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserToggle } from "@/components/UserToggle";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import Logo from "@/components/brand/Logo";

export function HeaderShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSignedIn } = useUser();

  return (
    <header className="h-14 flex items-center px-6 border-b border-border-light dark:border-border-light/60">
      {/* 왼쪽: 로고 + 메뉴 */}
      <div className="flex items-center gap-6">
        <Link href="/welcome">
          <Logo variant="bar" className="w-15 h-5" />
        </Link>

        {children}
      </div>

      {/* 오른쪽: 사용자 / 테마 */}
      <div className="ml-auto flex items-center gap-6">
        {!isSignedIn ? (
          <>
            <Button asChild size="sm">
              <Link href="/sign-in">로그인</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/sign-up">회원가입</Link>
            </Button>
          </>
        ) : (
          <UserToggle />
        )}

        <ThemeToggle />
      </div>
    </header>
  );
}
