"use client";

import { useState } from "react";

import { MessageSquare, Folder, User, BarChart2 } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserToggle } from "@/components/UserToggle";
import { useAuth } from "@clerk/nextjs";
import ChatPanel from "@/app/ide/components/chat/ChatPanel";
import WebICEditor from "@/app/ide/components/editor/WebICEditor";

type ClientIdeShellProps = {
  id: number;
};

type LeftPanelTab = "chat" | "filetree" | "invite" | null;

import { WebICContextProvider } from "@/app/ide/contexts/WebICContext";
import InvitePanel from "./invite/InvitePanel";

export default function ClientIdeShell({ id }: ClientIdeShellProps) {
  const [activeTab, setActiveTab] = useState<LeftPanelTab>("chat");
  const { userId } = useAuth();

  const resolvedUserId =
    process.env.NEXT_PUBLIC_DISABLE_AUTH === "true" ? 1 : Number(userId);

  if (!resolvedUserId) return null;
  //임시
  //const myUserId = 1;

  return (
    <WebICContextProvider containerId={id} myUserId={resolvedUserId}>
      <main className="h-screen w-screen bg-bg-base text-text-primary">
        <div className="flex h-full">
          {/* Left Sidebar */}
          <aside className="flex h-full">
            <div className="w-12 bg-bg-subtle border-r border-border-light flex flex-col items-center py-4 justify-between h-full shrink-0">
              <div className="flex flex-col items-center gap-4">
                <Link
                  href="/dashboard/stats"
                  title="Statistics"
                  className="p-2 text-text-secondary hover:text-text-primary transition-colors"
                >
                  <BarChart2 size={22} />
                </Link>

                {/* 2. File Explorer Toggle */}
                <button
                  onClick={() =>
                    setActiveTab(activeTab === "filetree" ? null : "filetree")
                  }
                  className={`p-2 rounded-lg transition-all ${
                    activeTab === "filetree"
                      ? "bg-blue-500/10 text-blue-500"
                      : "text-text-secondary hover:text-text-primary hover:bg-bg-raised/50"
                  }`}
                  title="Explorer"
                >
                  <Folder size={22} />
                </button>

                {/* 3. Chat Toggle */}
                <button
                  onClick={() =>
                    setActiveTab(activeTab === "chat" ? null : "chat")
                  }
                  className={`p-2 rounded-lg transition-all ${
                    activeTab === "chat"
                      ? "bg-blue-500/10 text-blue-500"
                      : "text-text-secondary hover:text-text-primary hover:bg-bg-raised/50"
                  }`}
                  title="Chat"
                >
                  <MessageSquare size={22} />
                </button>

                {/* 4. Invite Toggle */}
                <button
                  onClick={() =>
                    setActiveTab(activeTab === "invite" ? null : "invite")
                  }
                  className={`p-2 rounded-lg transition-all ${
                    activeTab === "invite"
                      ? "bg-blue-500/10 text-blue-500"
                      : "text-text-secondary hover:text-text-primary hover:bg-bg-raised/50"
                  }`}
                  title="Invite"
                >
                  <User size={22} />
                </button>
              </div>

              <div className="flex flex-col items-center gap-6 pb-6 mt-auto">
                <ThemeToggle />
                <UserToggle />
              </div>
            </div>

            {/* Dynamic Panel */}
            {activeTab && (
              <div className="w-[300px] border-r border-border-light bg-bg-raised">
                {activeTab === "filetree" && <WebICEditor.LeftPanel />}
                {activeTab === "chat" && <ChatPanel containerId={Number(id)} />}
                {activeTab === "invite" && (
                  <InvitePanel containerId={Number(id)} />
                )}
              </div>
            )}
          </aside>

          {/* Editor Area */}
          <section className="flex-1 bg-bg-base overflow-hidden">
            <WebICEditor.Main />
          </section>
        </div>
      </main>
    </WebICContextProvider>
  );
}
