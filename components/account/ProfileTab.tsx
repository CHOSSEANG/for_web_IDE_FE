import SocialConnections from "./SocialConnections";

export default function ProfileTab() {
  return (
    <section className="space-y-8">

      {/* Profile Summary */}
      <div className="flex items-center gap-6 bg-[#2A3142] rounded-2xl p-6">
        <div className="relative">
          <div className="h-20 w-20 rounded-full bg-[#3A4152] flex items-center justify-center text-3xl">
            👤
          </div>
          <button className="absolute -bottom-1 -right-1 rounded-full bg-indigo-500 p-2 text-xs">
            📷
          </button>
        </div>

        <div className="flex-1">
          <p className="text-lg font-medium">김철수</p>
          <p className="text-sm text-gray-400">user@example.com</p>
        </div>

        <button className="rounded-lg bg-indigo-500 px-4 py-2 text-sm hover:bg-indigo-600">
          프로필 수정
        </button>
      </div>

      {/* Basic Info */}
      <div className="bg-[#2A3142] rounded-2xl p-6 space-y-6">
        <InfoRow label="이름" value="김철수" />
        <InfoRow label="이메일" value="user@example.com" />
        <InfoRow label="전화번호" value="010-1234-5678" />
      </div>

      <SocialConnections />
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-white/5 pb-4 last:border-none">
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-base">{value}</p>
    </div>
  );
}
