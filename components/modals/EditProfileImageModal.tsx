type Props = {
  open: boolean;
  onClose: () => void;
};

export default function EditProfileImageModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8">
      <div className="w-full max-w-sm rounded-3xl border border-border-strong bg-bg-raised p-6">
        <h2 className="text-base font-semibold text-text-primary mb-4">
          프로필 사진 변경
        </h2>

        {/* 미리보기 */}
        <div className="flex justify-center mb-4">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border border-border-strong bg-bg-subtle text-3xl">
            👤
          </div>
        </div>

        {/* 업로드 */}
        <label className="block w-full cursor-pointer rounded-2xl border border-border-strong bg-bg-subtle px-4 py-2 text-center text-sm font-semibold text-text-primary transition hover:border-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60">
          사진 업로드
          <input type="file" accept="image/*" className="hidden" />
        </label>

        {/* 액션 */}
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
