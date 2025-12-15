"use client";

import AccountModal from "@/components/account/AccountModal";
import { useAccountModal } from "@/components/account/useAccountModal";

export default function RootLayout({ children }) {
  const { open, closeModal } = useAccountModal();

  return (
    <>
      {children}
      <AccountModal open={open} onClose={closeModal} />
    </>
  );
}
