// // @/component/layout/Header/PublicMenu.tsx 
// ide 접속자에게 노출되는 메뉴 
"use client";

import Link from "next/link";

type Props = {
  variant?: "desktop" | "mobile";
  onItemClick?: () => void; // 모바일에서 햄버거 닫기용
};

export default function PublicMenu({
  variant = "desktop",
  onItemClick,
}: Props) {
  const isMobile = variant === "mobile";

  return (
    <nav
      className={
        isMobile
          ? "flex flex-col gap-2 text-sm text-text-primary"
          : "flex items-center gap-6 text-sm text-text-muted"
      }
    >

      <Link
        href="/company"
        onClick={onItemClick}
        className={
          isMobile
            ? "rounded-md px-3 py-2 hover:bg-bg-subtle transition"
            : "hover:text-text-primary transition"
        }
      >
        회사소개
      </Link>

      <Link
        href="/serviceinfo"
        onClick={onItemClick}
        className={
          isMobile
            ? "rounded-md px-3 py-2 hover:bg-bg-subtle transition"
            : "hover:text-text-primary transition"
        }
      >
        서비스 소개
      </Link>

      <Link
        href="/contact"
        onClick={onItemClick}
        className={
          isMobile
            ? "rounded-md px-3 py-2 hover:bg-bg-subtle transition"
            : "hover:text-text-primary transition"
        }
      >
        문의하기
      </Link>
    </nav>
  );
}
