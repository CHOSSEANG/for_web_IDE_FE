"use client";

import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded-2xl bg-[#1E2433] p-6">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">비밀번호 변경</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-3">
          <input
            type="password"
            placeholder="현재 비밀번호"
            className="w-full rounded-lg bg-[#2F3547] px-3 py-2 text-sm outline-none"
          />
          <input
            type="password"
            placeholder="새 비밀번호"
            className="w-full rounded-lg bg-[#2F3547] px-3 py-2 text-sm outline-none"
          />
          <input
            type="password"
            placeholder="새 비밀번호 확인"
            className="w-full rounded-lg bg-[#2F3547] px-3 py-2 text-sm outline-none"
          />

          <p className="text-xs text-gray-400">
            비밀번호는 8자 이상이며, 영문/숫자를 포함해야 합니다.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg bg-[#2F3547] px-4 py-2 text-sm hover:bg-[#3A4152]"
          >
            취소
          </button>
          <button className="rounded-lg bg-indigo-500 px-4 py-2 text-sm hover:bg-indigo-600">
            변경하기
          </button>
        </div>
      </div>
    </div>
  );
}
