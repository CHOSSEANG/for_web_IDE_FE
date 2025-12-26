// 계정 정보를 페이지로 띄우기가 필요할 경우를 대비 
"use client";

import type { ReactNode } from "react";
import AccountModal from "@/components/account/AccountModal";
import { useAccountModal } from "@/components/account/useAccountModal";

export default function RootLayout({ children }: { children: ReactNode }) {
  const { open, closeModal } = useAccountModal();

  console.log("🟢 modal open =", open);

  return (
    <>
      {children}
      {/* AccountModal opens when UserToggle flips zustand openModal to true and the root layout renders it. */}
      <AccountModal open={open} onClose={closeModal} />
    </>
  );
}
