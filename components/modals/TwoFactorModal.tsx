"use client";

import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function TwoFactorModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded-2xl bg-[#1E2433] p-6">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">2단계 인증</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-3 text-sm text-gray-300">
          <p>
            2단계 인증을 활성화하면 로그인 시 추가 인증을 통해
            계정 보안을 강화할 수 있습니다.
          </p>
          <p className="text-xs text-gray-400">
            • 지원 방식: 인증 앱 (Google Authenticator 등)
          </p>
        </div>

        {/* Footer */}
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg bg-[#2F3547] px-4 py-2 text-sm hover:bg-[#3A4152]"
          >
            닫기
          </button>
          <button className="rounded-lg bg-indigo-500 px-4 py-2 text-sm hover:bg-indigo-600">
            설정 시작
          </button>
        </div>
      </div>
    </div>
  );
}
