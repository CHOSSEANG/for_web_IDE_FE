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
      <DialogContent className="max-w-[min(960px,65vw)]">
        <VisuallyHidden>
          <DialogTitle>내 정보</DialogTitle>
        </VisuallyHidden>

        <AccountContent />
      </DialogContent>
    </Dialog>
  );
}
