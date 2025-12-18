// @/component/layout/Header/PublicMenu.tsx
// 로그인전 사용자에게 노출되는 메뉴
 
"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

export default function Header() {
  const { isSignedIn } = useUser();

  return (
    <div className="w-full flex justify-between items-center py-6 px-8 border-border-light dark:border-border-light/60">
      {/* 좌측: 네비게이션 */}
      <div className="flex items-center gap-6 text-sm text-text-muted">
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
    </div>
  );
}
