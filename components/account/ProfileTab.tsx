import { useState } from "react";
import SocialConnections from "@/components/account/SocialConnections";
import EditProfileModal from "@/components/modals/EditProfileModal";
import EditProfileImageModal from "@/components/modals/EditProfileImageModal";

export default function ProfileTab() {
  const [editOpen, setEditOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);


  return (
    <>
    <section className="space-y-4">

      {/* 프로필 요약 */}
      <div className="bg-[#2A3142] rounded-2xl p-4">
        <div className="flex items-center justify-between gap-4">

          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-14 w-14 rounded-full bg-[#3A4152] flex items-center justify-center text-2xl">
                👤
              </div>
                <button onClick={() => setImageOpen(true)}
                  className="absolute -bottom-1 -right-1 rounded-full bg-indigo-500 p-1.5 text-[10px]">
                📷
              </button>
            </div>

            <div className="leading-snug">
              <p className="text-sm font-medium">김철수</p>
              <p className="text-xs text-gray-400">user@example.com</p>
            </div>
          </div>

          <button onClick={() => setEditOpen(true)}
            className="shrink-0 rounded-lg bg-indigo-500 px-4 py-2 text-sm hover:bg-indigo-600 whitespace-normal break-keep">
            프로필 수정
          </button>
        </div>
      </div>

      {/* 기본 정보 */}
      <div className="bg-[#2A3142] rounded-2xl p-4 space-y-3">
        <InfoRow label="이름" value="김철수" />
        <InfoRow label="이메일" value="user@example.com" />
        <InfoRow label="전화번호" value="010-1234-5678" />
      </div>

      {/* 소셜 연결 */}
      <div className="bg-[#2A3142] rounded-2xl p-4">
        <SocialConnections />
      </div>

    </section>

    {/* 모달 */ }
      <EditProfileModal open={editOpen} onClose={() => setEditOpen(false)} />
      <EditProfileImageModal open={imageOpen} onClose={() => setImageOpen(false)}/>
    </>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-2 last:border-none last:pb-0">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm">{value}</p>
    </div>
  );
}
