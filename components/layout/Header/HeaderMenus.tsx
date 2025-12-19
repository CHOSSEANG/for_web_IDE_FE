// components/layout/Header/HeaderMenus.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import AuthMenu from "@/components/layout/Header/menus/AuthMenu";
import IdeMenu from "@/components/layout/Header/menus/IdeMenu";
import PublicMenu from "@/components/layout/Header/menus/PublicMenu";

export function HeaderMenus() {
  const { isSignedIn } = useUser();
  const pathname = usePathname();

  const isIdePage = pathname.startsWith("/app");

  if (!isSignedIn) return <PublicMenu />;
  if (isIdePage) return <IdeMenu />;
  return <AuthMenu />;
}
