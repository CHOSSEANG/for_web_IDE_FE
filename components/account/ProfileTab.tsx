"use client";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import SocialConnections from "@/components/account/SocialConnections";
import EditProfileModal from "@/components/modals/EditProfileModal";
import EditProfileImageModal from "@/components/modals/EditProfileImageModal";

export default function ProfileTab() {
  const [editOpen, setEditOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const { isLoaded, user } = useUser();

  const displayName =
    user?.fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    "사용자";
  const email = user?.primaryEmailAddress?.emailAddress ?? "이메일 정보 없음";

  return (
    <>
      <section className="space-y-5">

        {/* 프로필 요약 */}
        <div className="rounded-3xl border border-border-strong bg-bg-subtle/70 p-5">
          <div className="flex items-center justify-between gap-4">

              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border-strong bg-bg-raised text-2xl">
                    {user?.imageUrl ? (
                      <img
                        src={user.imageUrl}
                        alt="프로필"
                        className="h-14 w-14 rounded-full object-cover"
                      />
                    ) : (
                      "👤"
                    )}
                  </div>
                  <button
                    onClick={() => setImageOpen(true)}
                    className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
                  >
                    📷
                  </button>
                </div>

                <div className="leading-snug">
                  <p className="text-sm font-semibold text-text-primary">
                    {isLoaded ? displayName : "로딩 중..."}
                  </p>
                  <p className="text-xs text-text-muted">{isLoaded ? email : ""}</p>
                </div>
              </div>

            <button
              onClick={() => setEditOpen(true)}
              className="shrink-0 rounded-2xl border border-border-strong bg-bg-subtle px-4 py-2 text-sm font-semibold text-text-primary transition hover:border-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
            >
              프로필 수정
            </button>
          </div>
        </div>

        {/* 기본 정보 */}
        <div className="rounded-3xl border border-border-strong bg-bg-subtle/70 p-5 space-y-3">
          <InfoRow label="이름" value="김철수" />
          <InfoRow label="이메일" value="user@example.com" />
          <InfoRow label="전화번호" value="010-1234-5678" />
        </div>

        {/* 소셜 연결 */}
        <div className="rounded-3xl border border-border-strong bg-bg-subtle/70 p-5">
          <SocialConnections />
        </div>

      </section>

      {/* 모달 */}
      <EditProfileModal open={editOpen} onClose={() => setEditOpen(false)} />
      <EditProfileImageModal open={imageOpen} onClose={() => setImageOpen(false)} />
    </>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border-strong pb-2 last:border-none last:pb-0">
      <p className="text-xs uppercase tracking-wide text-text-muted">{label}</p>
      <p className="text-sm font-semibold text-text-primary">{value}</p>
    </div>
  );
}
