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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-sm rounded-2xl bg-[#1E2433] p-6 shadow-xl">

        {/* Title */}
        <h2 className="text-lg font-semibold text-red-400 mb-2">
          계정을 탈퇴하시겠습니까?
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-400 leading-snug mb-4">
          계정을 탈퇴하면 모든 데이터가 영구적으로 삭제되며,<br />
          이 작업은 되돌릴 수 없습니다.
        </p>

        {/* Password input (직접 입력 필수) */}
        <div className="mb-4">
          <form autoComplete="off">
          <label className="block text-xs text-gray-400 mb-1">
            비밀번호 확인
          </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호를 직접 입력하세요"
          autoComplete="new-password"
          name="delete-confirm-password"
          className="w-full rounded-lg bg-[#2A3142] px-3 py-2 text-sm text-white placeholder-gray-500
                    focus:outline-none focus:ring-2 focus:ring-red-500/60"
        /></form>

        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg bg-[#3A4152] px-4 py-2 text-sm hover:bg-[#4A5162]"
          >
            취소
          </button>

          <button
            disabled={!canDelete}
            className={`rounded-lg px-4 py-2 text-sm transition
              ${
                canDelete
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-red-500/30 cursor-not-allowed"
              }`}
          >
            탈퇴하기
          </button>
        </div>

      </div>
    </div>
  );
}
