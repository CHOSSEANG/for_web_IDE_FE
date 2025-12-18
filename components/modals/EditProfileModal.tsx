"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
}

export default function EditProfileModal({
  open,
  onClose,
}: EditProfileModalProps) {
  const { isLoaded, user } = useUser();
  const [fullName, setFullName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open && isLoaded && user) {
      const nameParts = [
        user.firstName?.trim(),
        user.lastName?.trim(),
      ].filter(Boolean);
      setFullName(nameParts.join(" "));
    }
  }, [open, isLoaded, user]);

  if (!open || !isLoaded || !user) return null;

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);

    try {
      const trimmed = fullName.trim();
      const [firstName = "", ...rest] = trimmed.split(/\s+/);
      const lastName = rest.join(" ");

      const payload: Parameters<typeof user["update"]>[0] = {
        firstName,
        lastName,
      };

      await user.update(payload);
      await user.reload();
      onClose();
    } catch (error) {
      console.error("프로필 저장 중 오류", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="w-full max-w-md rounded-2xl  bg-bg-raised p-6 text-text-primary">
        <VisuallyHidden>
          <h2>프로필 수정</h2>
        </VisuallyHidden>
        {/* Header */} 
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">프로필 수정</h2>
          <button
            onClick={onClose}
            className="text-sm text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* 이름 */}
          <div>
            <label className="mb-1 block text-xs text-text-muted">이름</label>
            <input
              type="text"
              placeholder="김철수"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="w-full rounded-lg border border-border-strong bg-bg-subtle px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60 transition-colors"
            />
          </div>

          {/* 이메일 */}
          <div>
            <label className="mb-1 block text-xs text-text-muted">이메일</label>
            <input
              type="email"
              disabled
              value={user.primaryEmailAddress?.emailAddress ?? ""}
              className="w-full cursor-not-allowed rounded-lg border border-border-strong bg-bg-subtle px-3 py-2 text-sm text-text-muted"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-2xl border border-border-strong bg-bg-subtle px-4 py-2 text-sm font-semibold text-text-primary transition hover:border-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60">
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
}
