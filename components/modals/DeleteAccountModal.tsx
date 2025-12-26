// @/components/modals/DeleteAccountModal.tsx
"use client";

import { useState } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useUser } from "@clerk/nextjs";

type DeleteAccountModalProps = {
  open: boolean;
  onClose: () => void;
  onDeleted: () => void;
};

export default function DeleteAccountModal({
  open,
  onClose,
  onDeleted,
}: DeleteAccountModalProps) {
  const { user, isLoaded } = useUser();

  const [email, setEmail] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const userEmail = user?.primaryEmailAddress?.emailAddress ?? "";

  const canDelete =
    isLoaded &&
    !!user &&
    email === userEmail &&
    !isDeleting;

  const handleDelete = async () => {
    if (!user || !canDelete) return;

    try {
      setIsDeleting(true);
      setError("");

      // ✅ Clerk 계정 삭제
      await user.delete();

      // 1️⃣ 탈퇴 모달 닫기
      onClose();

      // 2️⃣ 상위(Account)에게 탈퇴 완료 알림
      onDeleted();
    } catch (e) {
      console.error("계정 탈퇴 실패", e);
      setError("계정 탈퇴 중 오류가 발생했습니다.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-8">
      <div className="w-full max-w-sm rounded-3xl border border-border-strong bg-bg-raised p-6">
        <VisuallyHidden>
          <h2>계정 탈퇴</h2>
        </VisuallyHidden>

        <h2 className="text-lg font-semibold text-red-300 mb-2">
          계정을 탈퇴하시겠습니까?
        </h2>

        <p className="text-sm text-text-muted mb-4">
          계정을 탈퇴하면 모든 데이터가 영구적으로 삭제됩니다.
        </p>

        <label className="block text-xs font-semibold text-text-muted mb-1">
          이메일 확인
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일을 직접 입력하세요"
          autoComplete="off"
          className="w-full rounded-2xl border border-border-strong bg-bg-subtle px-3 py-2 text-sm text-text-primary"
        />

        {email && email !== userEmail && (
          <p className="mt-1 text-xs text-red-400">
            현재 로그인된 이메일과 일치하지 않습니다.
          </p>
        )}

        {error && (
          <p className="mt-2 text-xs text-red-400">{error}</p>
        )}

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-2xl border border-border-strong bg-bg-subtle px-4 py-2 text-sm font-semibold text-text-primary disabled:opacity-60"
          >
            취소
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={!canDelete}
            className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
              canDelete
                ? "bg-red-500 text-white hover:bg-red-400"
                : "bg-red-500/40 text-white/80 cursor-not-allowed"
            }`}
          >
            {isDeleting ? "탈퇴 처리 중..." : "탈퇴하기"}
          </button>
        </div>
      </div>
    </div>
  );
}
