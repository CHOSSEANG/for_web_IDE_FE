export default function InviteUserForm() {
  return (
    <div className="mt-4">
      <input
        placeholder="사용자 이름 또는 ID"
        className="w-full px-2 py-1 rounded bg-[#0E1325] border border-white/10 text-sm"
      />
      <button className="mt-2 w-full py-1 rounded bg-indigo-500 text-sm">
        초대하기
      </button>
    </div>
  );
}
