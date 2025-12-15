"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
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
      <DialogContent className="max-w-5xl bg-[#0A0F1D] text-white">
        <AccountContent />
      </DialogContent>
    </Dialog>
  );
}
