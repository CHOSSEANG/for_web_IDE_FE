// @/components/modals/DeleteAccountModal.tsx
// 계정 탈퇴 모달
// ⚠️ 소셜 로그인 사용자를 고려하여 "비밀번호 입력"이 아닌
// "이메일 입력 인증" 방식으로 탈퇴 진행
// (백엔드 연동 시 이메일 검증 기반으로 처리 필요)

"use client";

import { useState } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

type DeleteAccountModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function DeleteAccountModal({
  open,
  onClose,
}: DeleteAccountModalProps) {
  /**
   * ⚠️ 계정 탈퇴 인증 방식
   * - 소셜 로그인 사용자를 고려하여
   * - 비밀번호 입력이 아닌 "이메일 입력 인증" 방식으로 진행
   * - 백엔드 연동 시 이메일 검증 기반 탈퇴 처리 필요
   */
  const [email, setEmail] = useState("");

  if (!open) return null;

  const canDelete = email.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-8">
      <div className="w-full max-w-sm rounded-3xl border border-border-strong bg-bg-raised p-6">
        <VisuallyHidden>
          <h2>계정 탈퇴</h2>
        </VisuallyHidden>

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

        {/* Email input (직접 입력 필수) */}
        <div className="mb-4">
          <form autoComplete="off">
            <label className="block text-xs font-semibold text-text-muted mb-1">
              이메일 확인
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 직접 입력하세요"
              autoComplete="off"
              name="delete-confirm-email"
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
