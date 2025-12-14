"use client";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserToggle } from "@/components/UserToggle";

import Logo from "@/components/brand/Logo";

export default function Header() {
  return (
    <header className="w-full flex justify-between items-center py-6 px-8 border-b border-border-light">
      {/* 좌측: 네비게이션 */}
      <div className="flex gap-6 text-sm text-text-muted">
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

      {/* 우측: 토글 */}
      <div className="flex gap-3">
        <UserToggle />
        <ThemeToggle />
      </div>
    </header>
  );
}
