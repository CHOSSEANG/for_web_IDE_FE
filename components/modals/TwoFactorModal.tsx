"use client";

import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function TwoFactorModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8">
      <div className="w-full max-w-md rounded-3xl border border-border-strong bg-bg-raised/90 p-6">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">2단계 인증</h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-3 text-sm text-text-muted">
          <p>
            2단계 인증을 활성화하면 로그인 시 추가 인증을 통해
            계정 보안을 강화할 수 있습니다.
          </p>
          <p className="text-xs text-text-muted">
            • 지원 방식: 인증 앱 (Google Authenticator 등)
          </p>
        </div>

        {/* Footer */}
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-2xl border border-border-strong bg-bg-subtle px-4 py-2 text-sm font-semibold text-text-primary transition hover:border-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
          >
            닫기
          </button>
          <button className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60">
            설정 시작
          </button>
        </div>
      </div>
    </div>
  );
}
