// @/components/account/AccountContent.tsx
// 회원 프로필 모달창 > 컨텐츠 부분

"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { X } from "lucide-react";

import ProfileTab from "@/components/account/ProfileTab";
import SecurityTab from "@/components/account/SecurityTab";

type Props = {
  onClose: () => void;
};

export default function AccountContent({ onClose }: Props) {
  const [activeTab, setActiveTab] =
    useState<"profile" | "security">("profile");

  const { signOut } = useClerk();
  const router = useRouter();

  /** 로그아웃 → 모달 닫기 → 페이지 이동 */
  const handleLogout = async () => {
    onClose();        // 1️⃣ 모달 닫기
    await signOut();  // 2️⃣ 로그아웃
    router.push("/"); // 3️⃣ 페이지 이동
  };

  return (
    <div className="relative space-y-8 px-0 py-0">

      {/* Header */}
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text-primary">
          계정 관리
        </h1>

        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          aria-label="닫기"
          className="rounded-full p-2 text-text-muted hover:text-text-primary transition"
        >
          <X size={18} />
        </button>
      </header>

      {/* Tabs */}
      <nav className="flex gap-6 border-b border-border-strong pb-2 text-sm">
        <TabButton
          active={activeTab === "profile"}
          onClick={() => setActiveTab("profile")}
        >
          프로필
        </TabButton>

        <TabButton
          active={activeTab === "security"}
          onClick={() => setActiveTab("security")}
        >
          보안
        </TabButton>
      </nav>

      {/* Content */}
      {activeTab === "profile" ? <ProfileTab /> : <SecurityTab />}

      {/* Logout */}
      <div className="text-center">
        <button
          onClick={handleLogout}
          className="rounded-2xl border border-border-strong bg-bg-subtle px-4 py-2 text-sm font-semibold text-text-primary transition hover:border-blue-500"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}

function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`pb-2 font-semibold transition ${
        active
          ? "text-blue-400 border-b-2 border-blue-400"
          : "text-text-muted hover:text-text-primary"
      }`}
    >
      {children}
    </button>
  );
}
