// components/account/AccountModalRoot.tsx
"use client";

import AccountModal from "./AccountModal";
import { useAccountModal } from "./useAccountModal";

export default function AccountModalRoot() {
  const { open, closeModal } = useAccountModal();

  return <AccountModal open={open} onClose={closeModal} />;
}
