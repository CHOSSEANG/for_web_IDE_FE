// @/componenets/account/AccountModal.tsx 
// 회원 프로필 모달창 

"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import AccountContent from "./AccountContent";

type AccountModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function AccountModal({
  open,
  onClose,
}: AccountModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="w-full mx-2 top-4 -translate-y-0
        sm:mx-auto sm:max-w-[min(960px,65vw)] sm:top-1/2 sm:-translate-y-1/2
        max-h-[calc(100vh-1.5rem)] overflow-y-auto"
      >
        <VisuallyHidden>
          <DialogTitle>계정 관리</DialogTitle>
        </VisuallyHidden>

        <AccountContent />
      </DialogContent>
    </Dialog>
  );
}
