
"use client";

import AccountContent from "./AccountContent";

export default function AccountPanel() {
  const handleClose = () => {};
  return (
    <div
      className="
        w-[520px]
        max-w-[95vw]
        max-h-[85vh]
        overflow-y-auto
        rounded-2xl
        bg-bg-raised
        text-text-primary
        border border-border-strong
      "
    >
      
    <AccountContent onClose={handleClose} />
    </div>
  );
}
