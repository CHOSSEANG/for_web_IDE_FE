"use client";

import { useState } from "react";
import { MessageSquare, Folder } from "lucide-react";

import ChatPanel from "@/app/ide/components/chat/ChatPanel";
import WebICEditor from "@/app/ide/components/editor/WebICEditor";

type ClientIdeShellProps = {
  id: string;
};

type LeftPanelTab = "chat" | "filetree";

import { WebICContextProvider } from "@/app/ide/contexts/WebICContext";

export default function ClientIdeShell({ id }: ClientIdeShellProps) {
  const [activeTab, setActiveTab] = useState<LeftPanelTab>("chat");

  return (
    <WebICContextProvider containerId={id}>
      <main className="h-screen w-screen bg-[#0B1020] text-white">
        <div className="flex h-full">
          {/* Left Sidebar */}
          <aside className="flex h-full">
            {/* Icon Bar */}
            <div className="w-12 bg-[#0E1325] border-r border-white/10 flex flex-col items-center py-3 gap-4">
              <button
                onClick={() => setActiveTab("chat")}
                className={`p-2 rounded transition ${activeTab === "chat"
                  ? "text-indigo-400 bg-white/10"
                  : "text-gray-400 hover:text-white"
                  }`}
              >
                <MessageSquare size={20} />
              </button>

              <button
                onClick={() => setActiveTab("filetree")}
                className={`p-2 rounded transition ${activeTab === "filetree"
                  ? "text-indigo-400 bg-white/10"
                  : "text-gray-400 hover:text-white"
                  }`}
              >
                <Folder size={20} />
              </button>
            </div>

            {/* Dynamic Panel */}
            <div className="w-[300px] border-r border-white/10 bg-[#12182B]">
              {activeTab === "chat" && <ChatPanel containerId={id} />}
              {activeTab === "filetree" && <WebICEditor.LeftPanel />}
            </div>
          </aside>

          {/* Editor Area */}
          <section className="flex-1 bg-[#0E1325]">
            <WebICEditor.Main />
          </section>
        </div>
      </main>
    </WebICContextProvider>
  );
}
