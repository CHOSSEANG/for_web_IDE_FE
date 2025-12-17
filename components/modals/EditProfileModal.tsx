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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded-2xl bg-[#1F2433] p-6">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">프로필 수정</h2>
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
            <label className="mb-1 block text-xs text-gray-400">이름</label>
            <input
              type="text"
              placeholder="김철수"
              className="w-full rounded-lg bg-[#2A3142] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* 이메일 */}
          <div>
            <label className="mb-1 block text-xs text-gray-400">이메일</label>
            <input
              type="email"
              disabled
              placeholder="user@example.com"
              className="w-full cursor-not-allowed rounded-lg bg-[#2A3142] px-3 py-2 text-sm text-gray-400"
            />
          </div>

          {/* 전화번호 */}
          <div>
            <label className="mb-1 block text-xs text-gray-400">
              전화번호
            </label>
            <input
              type="tel"
              placeholder="010-1234-5678"
              className="w-full rounded-lg bg-[#2A3142] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg bg-[#2F3547] px-4 py-2 text-sm hover:bg-[#3A4152]"
          >
            취소
          </button>
          <button className="rounded-lg bg-indigo-500 px-4 py-2 text-sm hover:bg-indigo-600">
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
