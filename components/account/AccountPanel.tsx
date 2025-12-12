"use client";

import AccountContent from "./AccountContent";

export default function AccountPanel() {
  return (
    <div
      className="
        w-[520px]
        max-w-[95vw]
        max-h-[85vh]
        overflow-y-auto
        rounded-2xl
        bg-[#0A0F1D]
        shadow-2xl
        border border-white/10
      "
    >
      <AccountContent />
    </div>
  );
}
