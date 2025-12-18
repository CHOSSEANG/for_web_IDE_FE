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
      <DialogContent className="w-full mx-2 sm:mx-auto sm:max-w-[min(960px,65vw)]">
        <VisuallyHidden>
          <DialogTitle>계정 관리</DialogTitle>
        </VisuallyHidden>

        <AccountContent />
      </DialogContent>
    </Dialog>
  );
}
