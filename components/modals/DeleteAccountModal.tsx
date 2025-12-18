"use client";

import { useState } from "react";

type DeleteAccountModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function DeleteAccountModal({
  open,
  onClose,
}: DeleteAccountModalProps) {
  const [password, setPassword] = useState("");

  if (!open) return null;

  const canDelete = password.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8">
      <div className="w-full max-w-sm rounded-3xl border border-border-strong bg-bg-raised/90 p-6">

        {/* Title */}
        <h2 className="text-lg font-semibold text-red-300 mb-2">
          계정을 탈퇴하시겠습니까?
        </h2>

        {/* Description */}
        <p className="text-sm text-text-muted leading-snug mb-4">
          계정을 탈퇴하면 모든 데이터가 영구적으로 삭제되며,
          <br />
          이 작업은 되돌릴 수 없습니다.
        </p>

        {/* Password input (직접 입력 필수) */}
        <div className="mb-4">
          <form autoComplete="off">
            <label className="block text-xs font-semibold text-text-muted mb-1">
              비밀번호 확인
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 직접 입력하세요"
              autoComplete="new-password"
              name="delete-confirm-password"
              className="w-full rounded-2xl border border-border-strong bg-bg-subtle px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/60 transition-colors"
            />
          </form>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-2xl border border-border-strong bg-bg-subtle px-4 py-2 text-sm font-semibold text-text-primary transition hover:border-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
          >
            취소
          </button>

          <button
            disabled={!canDelete}
            className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
              canDelete
                ? "bg-red-500 text-white hover:bg-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/60"
                : "bg-red-500/40 text-white/80 cursor-not-allowed"
            }`}
          >
            탈퇴하기
          </button>
        </div>

      </div>
    </div>
  );
}
