// @/componenets/account/ChangePasswordModal.tsx
// 회원 프로필 모달창 > 비밀번호 변경

"use client";

import { X } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <div className="w-full max-w-md rounded-3xl bg-bg-raised p-6">
        <VisuallyHidden>
          <h2>비밀번호 변경</h2>
        </VisuallyHidden>
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">비밀번호 변경</h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-3">
          <input
            type="password"
            placeholder="현재 비밀번호"
            className="w-full rounded-2xl border border-border-strong bg-bg-subtle px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60 transition-colors"
          />
          <input
            type="password"
            placeholder="새 비밀번호"
            className="w-full rounded-2xl border border-border-strong bg-bg-subtle px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60 transition-colors"
          />
          <input
            type="password"
            placeholder="새 비밀번호 확인"
            className="w-full rounded-2xl border border-border-strong bg-bg-subtle px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60 transition-colors"
          />

          <p className="text-xs text-text-muted">
            비밀번호는 8자 이상이며, 영문/숫자를 포함해야 합니다.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-2xl border border-border-strong bg-bg-subtle px-4 py-2 text-sm font-semibold text-text-primary transition hover:border-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
          >
            취소
          </button>
          <button className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60">
            변경하기
          </button>
        </div>
      </div>
    </div>
  );
}
