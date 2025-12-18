"use client";

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
}

export default function EditProfileModal({
  open,
  onClose,
}: EditProfileModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8">
      <div className="w-full max-w-md rounded-3xl border border-border-strong bg-bg-raised/90 p-6 shadow-[0_25px_50px_rgba(2,6,27,0.65)]">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">프로필 수정</h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4 text-text-primary">
          {/* 이름 */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-text-muted">
              이름
            </label>
            <input
              type="text"
              placeholder="김철수"
              className="w-full rounded-2xl border border-border-strong bg-bg-subtle px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60 transition-colors"
            />
          </div>

          {/* 이메일 */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-text-muted">
              이메일
            </label>
            <input
              type="email"
              disabled
              placeholder="user@example.com"
              className="w-full cursor-not-allowed rounded-2xl border border-border-strong bg-bg-subtle/70 px-3 py-2 text-sm text-text-muted"
            />
          </div>

          {/* 전화번호 */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-text-muted">
              전화번호
            </label>
            <input
              type="tel"
              placeholder="010-1234-5678"
              className="w-full rounded-2xl border border-border-strong bg-bg-subtle px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60 transition-colors"
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
          <button className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60">
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
