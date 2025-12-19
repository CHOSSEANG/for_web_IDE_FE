// components/layout/Header/HeaderMenus.tsx

"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import AuthMenu from "@/components/layout/Header/menus/AuthMenu";
import IdeMenu from "@/components/layout/Header/menus/IdeMenu";
import PublicMenu from "@/components/layout/Header/menus/PublicMenu";

export function HeaderMenus() {
  const { isSignedIn } = useUser();
  const pathname = usePathname();
  const isIdePage = pathname.startsWith("/app");

  const [open, setOpen] = useState(false);

  /** 현재 상황에 맞는 메뉴 컴포넌트 선택 */
  const MenuComponent = !isSignedIn
    ? PublicMenu
    : isIdePage
    ? IdeMenu
    : AuthMenu;

  return (
    <>
      {/* ================= Desktop ================= */}
      <div className="hidden md:flex items-center gap-6">
        <MenuComponent />
      </div>

      {/* ================= Mobile ================= */}
      <div className="md:hidden relative">
        {/* 햄버거 버튼 */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="메뉴 열기"
          className="p-2 rounded-md hover:bg-bg-subtle transition"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* 드롭다운 메뉴 */}
        {open && (
          <div className="fixed left-1 top-14 z-50 w-56 rounded-xl border border-border-strong bg-bg-base p-4 shadow-lg">
            <MenuComponent
              variant="mobile"
              onItemClick={() => setOpen(false)}
            />
          </div>
        )}
      </div>
    </>
  );
}
