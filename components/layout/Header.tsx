"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";

import { ThemeToggle } from "@/components/ThemeToggle";
import { UserToggle } from "@/components/UserToggle";
import Logo from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { isSignedIn } = useUser();

  return (
    <header className="w-full flex justify-between items-center py-6 px-8 border-b border-border-light">
      {/* 좌측: 네비게이션 */}
      <div className="flex items-center gap-6 text-sm text-text-muted">
        <Link href="/welcome" className="hover:text-text-primary transition">
          <Logo variant="bar" className="w-15 h-5" />
        </Link>

        <Link href="/company" className="hover:text-text-primary transition">
          회사소개
        </Link>
        <Link href="/serviceinfo" className="hover:text-text-primary transition">
          서비스 소개
        </Link>
        <Link href="/contact" className="hover:text-text-primary transition">
          문의하기
        </Link>
      </div>

      {/* 우측: 인증 / 토글 영역 */}
      <div className="flex items-center gap-3">
        {/* 로그인 전 */}
        {!isSignedIn && (
          <>
          <Button asChild>
            <Link
              href="/sign-in"
              className="text-xs px-2 py-2 rounded-md hover:text-text-primary transition"
            >
              로그인
            </Link>
          </Button>
          <Button asChild>
            <Link
              href="/sign-up"
              className="text-xs  rounded-md px-2 py-2  hover:bg-bg-raised transition"
            >
              회원가입
            </Link>
          </Button>
          </>
        )}

        {/* 로그인 후 */}
        {isSignedIn && <UserToggle />}

        {/* 항상 노출 */}
        <ThemeToggle />
      </div>
    </header>
  );
}
