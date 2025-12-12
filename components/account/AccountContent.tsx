"use client";

import { useState } from "react";
import ProfileTab from "./ProfileTab";
import SecurityTab from "./SecurityTab";

export default function AccountContent() {
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");

  return (
    <div className="p-8 space-y-8">

      {/* Header */}
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">계정 관리</h1>
        <button className="rounded-lg bg-[#2F3547] px-4 py-2 text-sm hover:bg-[#3A4152]">
          로그아웃
        </button>
      </header>

      {/* Tabs */}
      <nav className="flex gap-6 border-b border-white/10 pb-2 text-sm">
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
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`pb-2 ${
        active
          ? "text-indigo-400 border-b-2 border-indigo-400"
          : "text-gray-400 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}
