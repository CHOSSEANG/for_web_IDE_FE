// components/account/AccountModalRoot.tsx

"use client";

import AccountModal from "./AccountModal";
import { useAccountModal } from "@/components/account/useAccountModal";


export default function AccountModalRoot() {
  console.log("AccountModalRoot mounted"); 
  const { open, closeModal } = useAccountModal();
  console.log("modal open:", open); 

  return <AccountModal open={open} onClose={closeModal} />;
}
