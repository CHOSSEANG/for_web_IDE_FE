"use client";

import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

import EditProfileModal from "@/components/modals/EditProfileModal";
import SocialConnections from "@/components/account/SocialConnections";
import EditProfileImageModal from "@/components/modals/EditProfileImageModal";

export default function ProfileTab() {
  const [editOpen, setEditOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { isLoaded, user } = useUser();

  /* =========================
   * 기본 사용자 정보 (Clerk 기준)
   * ========================= */
  const displayName =
    user?.fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    "사용자";

  const profileEmail = user?.primaryEmailAddress?.emailAddress ?? "";

  /* =========================
   * 프로필 이미지
   * - Clerk 단일 Source of Truth
   * ========================= */
  const profileImage = user?.imageUrl ?? "";
  const clerkId = user?.id ?? "";

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const handleCopyClerkId = async () => {
    if (!clerkId || typeof navigator === "undefined" || !navigator.clipboard) {
      return;
    }

    try {
      await navigator.clipboard.writeText(clerkId);
      setCopied(true);
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
      copyTimeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      // silently ignore failure
    }
  };

  return (
    <>
      <section className="space-y-5">
        {/* 프로필 요약 */}
        <div className="rounded-3xl border border-border-strong bg-bg-subtle/70 p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-border-strong bg-bg-raised text-2xl">
                  {profileImage ? (
                    <Image
                      src={profileImage}
                      alt="프로필"
                      width={56}
                      height={56}
                      className="rounded-full object-cover"
                      priority
                    />
                  ) : (
                    "👤"
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setImageOpen(true)}
                  className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white transition hover:bg-blue-500"
                >
                  📷
                </button>
              </div>

              <div className="leading-snug">
                <p className="text-sm font-semibold text-text-primary">
                  {isLoaded ? displayName : "로딩 중..."}
                </p>
                <p className="text-xs text-text-muted">
                  {isLoaded ? profileEmail : ""}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setEditOpen(true)}
              className="shrink-0 rounded-2xl border border-border-strong bg-bg-subtle px-4 py-2 text-sm font-semibold"
            >
              프로필 수정
            </button>
          </div>
        </div>

        {/* 기본 정보 */}
        <div className="rounded-3xl border border-border-strong bg-bg-subtle/70 p-5 space-y-3">
          <InfoRow label="이름" value={isLoaded ? displayName : ""} />
          <InfoRowWithCopy
            label="USER ID"
            value={isLoaded ? clerkId : ""}
            onCopy={handleCopyClerkId}
            copied={copied}
            disabled={!clerkId}
          />
        </div>

        {/* 소셜 연결 */}
        <div className="rounded-3xl border border-border-strong bg-bg-subtle/70 p-5">
          <SocialConnections />
        </div>
      </section>

      {/* 모달 */}
      <EditProfileModal open={editOpen} onClose={() => setEditOpen(false)} />
      <EditProfileImageModal
        open={imageOpen}
        onClose={() => setImageOpen(false)}
      />
    </>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[20%_80%] items-center border-b border-border-strong pb-2 last:border-none last:pb-0">
      <p className="text-xs uppercase tracking-wide text-text-muted">{label}</p>
      <p className="text-sm font-semibold text-text-primary text-left break-all">
        {value}
      </p>
    </div>
  );
}

function InfoRowWithCopy({
  label,
  value,
  onCopy,
  copied,
  disabled,
}: {
  label: string;
  value: string;
  onCopy: () => Promise<void> | void;
  copied: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="grid grid-cols-[20%_80%] items-center border-b border-border-strong pb-2 last:border-none last:pb-0">
      <p className="text-xs uppercase tracking-wide text-text-muted">{label}</p>
      <div className="flex items-center gap-2">
        <p className="flex-1 min-w-0 text-sm font-semibold text-text-primary text-left break-all">
          {value}
        </p>
        <button
          type="button"
          onClick={onCopy}
          disabled={disabled}
          className="rounded-full border border-border-strong bg-bg-raised/50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-text-primary transition hover:border-blue-500 disabled:opacity-50"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}
