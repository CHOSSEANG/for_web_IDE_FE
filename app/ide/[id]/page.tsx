"use client";

import { useState } from "react";
import { MessageSquare, FolderTree } from "lucide-react";

import ChatPanel from "@/app/ide/components/chat/ChatPanel";
import FileTree from "@/app/ide/components/filetree/FileTree";
import Editor from "@/app/ide/components/editor/Editor";

type LeftPanelTab = "chat" | "filetree";

interface IdePageProps {
  params: {
    id: string;
  };
}

export default function IdePage({ params }: IdePageProps) {
  const [activeTab, setActiveTab] = useState<LeftPanelTab>("chat");

  return (
    <main className="h-screen w-screen bg-[#0B1020] text-white">
      <div className="flex h-full">
        {/* Left Sidebar */}
        <aside className="flex h-full">
          {/* 1️⃣ Icon Toggle Bar */}
          <div className="w-12 bg-[#0E1325] border-r border-white/10 flex flex-col items-center py-3 gap-4">
            <button
              onClick={() => setActiveTab("chat")}
              className={`p-2 rounded transition
                ${
                  activeTab === "chat"
                    ? "text-indigo-400 bg-white/10"
                    : "text-gray-400 hover:text-white"
                }`}
            >
              <MessageSquare size={20} />
            </button>

            <button
              onClick={() => setActiveTab("filetree")}
              className={`p-2 rounded transition
                ${
                  activeTab === "filetree"
                    ? "text-indigo-400 bg-white/10"
                    : "text-gray-400 hover:text-white"
                }`}
            >
              <FolderTree size={20} />
            </button>
          </div>

          {/* 2️⃣ Dynamic Left Panel */}
          <div className="w-[300px] border-r border-white/10 bg-[#12182B]">
            {activeTab === "chat" && <ChatPanel containerId={params.id} />}

            {activeTab === "filetree" && <FileTree />}
          </div>
        </aside>

        {/* Right: Editor */}
        <section className="flex-1 bg-[#0E1325]">
          <Editor />
        </section>
      </div>
    </main>
  );
}
