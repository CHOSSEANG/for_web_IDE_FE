"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useAuth } from "@clerk/nextjs";

interface Props {
  open: boolean;
  onClose: () => void;
}

const MIN_PASSWORD_LENGTH = 8;

export default function ChangePasswordModal({ open, onClose }: Props) {
  const { getToken, isLoaded: isAuthLoaded } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async () => {
    if (submitting) return;
    if (!isAuthLoaded) {
      setErrorMessage("인증 정보가 아직 로딩되지 않았습니다.");
      return;
    }

    if (!currentPassword) {
      setErrorMessage("현재 비밀번호를 입력해 주세요.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setErrorMessage(`새 비밀번호는 ${MIN_PASSWORD_LENGTH}자 이상이어야 합니다.`);
      return;
    }

    const token = await getToken({ template: "jwt" });
    if (!token) {
      setErrorMessage("세션을 확인할 수 없습니다. 다시 로그인해 주세요.");
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/user/password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(
          data?.message ?? "비밀번호 변경에 실패했습니다. 다시 시도해 주세요."
        );
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      window.alert("비밀번호가 변경되었습니다.");
      onClose();
    } catch (error) {
      console.error("Change password failed:", error);
      const message =
        error instanceof Error
          ? error.message
          : "비밀번호 변경에 실패했습니다. 다시 시도해 주세요.";
      setErrorMessage(message);
    } finally {
      setSubmitting(false);
    }
  };

  const isDisabled =
    submitting ||
    !currentPassword ||
    !newPassword ||
    newPassword !== confirmPassword ||
    newPassword.length < MIN_PASSWORD_LENGTH;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <div className="w-full max-w-md rounded-3xl bg-bg-raised p-6">
        <VisuallyHidden>
          <h2>비밀번호 변경</h2>
        </VisuallyHidden>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">비밀번호 변경</h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          <input
            type="password"
            placeholder="현재 비밀번호"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            className="w-full rounded-2xl border border-border-strong bg-bg-subtle px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60 transition-colors"
          />
          <input
            type="password"
            placeholder="새 비밀번호"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            className="w-full rounded-2xl border border-border-strong bg-bg-subtle px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60 transition-colors"
          />
          <input
            type="password"
            placeholder="새 비밀번호 확인"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="w-full rounded-2xl border border-border-strong bg-bg-subtle px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60 transition-colors"
          />
          <p className="text-xs text-text-muted">
            비밀번호는 8자 이상이며, 영문/숫자를 포함해야 합니다.
          </p>
          {errorMessage && (
            <p className="text-sm text-red-500">{errorMessage}</p>
          )}
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-2xl border border-border-strong bg-bg-subtle px-4 py-2 text-sm font-semibold text-text-primary transition hover:border-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
          >
            취소
          </button>
          <button
            type="button"
            disabled={isDisabled}
            onClick={handleSubmit}
            className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
          >
            {submitting ? "변경 중..." : "변경하기"}
          </button>
        </div>
      </div>
    </div>
  );
}
