// @/componenets/account/AccountContent.tsx 
// 회원 프로필 모달창 > 컨덴츠 부분 

"use client";

import { useState } from "react";
import type { ReactNode } from "react"; // TabButton children 타입 정의에 ReactNode 사용
import ProfileTab from "@/components/account/ProfileTab";
import SecurityTab from "@/components/account/SecurityTab";
import { SignOutButton } from "@clerk/nextjs";



export default function AccountContent() {
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");

  return (
    <div className="space-y-8 px-0 py-2">

      {/* Header */}
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text-primary">계정 관리</h1>
        <SignOutButton redirectUrl="/welcome">
          <button className="rounded-2xl border border-border-strong bg-bg-subtle px-4 py-2 text-sm font-semibold text-text-primary transition hover:border-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60">
            로그아웃
          </button>
        </SignOutButton>
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
