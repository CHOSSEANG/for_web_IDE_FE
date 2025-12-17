type Props = {
  open: boolean;
  onClose: () => void;
};

export default function EditProfileImageModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm rounded-2xl bg-[#1F2537] p-6">
        <h2 className="text-base font-semibold mb-4">프로필 사진 변경</h2>

        {/* 미리보기 */}
        <div className="flex justify-center mb-4">
          <div className="h-24 w-24 rounded-full bg-[#3A4152] flex items-center justify-center text-3xl">
            👤
          </div>
        </div>

        {/* 업로드 */}
        <label className="block w-full cursor-pointer rounded-lg bg-[#2A3142] px-4 py-2 text-sm text-center hover:bg-[#3A4152]">
          사진 업로드
          <input type="file" accept="image/*" className="hidden" />
        </label>

        {/* 액션 */}
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
