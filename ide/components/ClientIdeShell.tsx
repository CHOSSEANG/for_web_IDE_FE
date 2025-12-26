"use client";

import { useState, useMemo } from "react";
import { MessageSquare, FolderTree } from "lucide-react";

import ChatPanel from "@/app/ide/components/chat/ChatPanel";

// WebIC Imports
import SplitLayout from "@/webic_ide_terminal/components/ui/SplitLayout";
import FileSidebar from "@/webic_ide_terminal/components/files/FileSidebar";
import MonacoEditor from "@/webic_ide_terminal/components/editor/MonacoEditor";
import TerminalPanel from "@/webic_ide_terminal/components/terminal/TerminalPanel";
import type { FileSystemItem } from "@/webic_ide_terminal/types/fileTypes";

/* ---------- Helper Functions ---------- */
const findItem = (
  items: FileSystemItem[],
  id: string
): FileSystemItem | undefined => {
  for (const item of items) {
    if (item.id === id) return item;
    if (item.children) {
      const found = findItem(item.children, id);
      if (found) return found;
    }
  }
  return undefined;
};

const updateItem = (
  items: FileSystemItem[],
  id: string,
  updater: (item: FileSystemItem) => FileSystemItem
): FileSystemItem[] =>
  items.map((item) => {
    if (item.id === id) return updater(item);
    if (item.children) {
      return { ...item, children: updateItem(item.children, id, updater) };
    }
    return item;
  });

const deleteItem = (items: FileSystemItem[], id: string): FileSystemItem[] =>
  items
    .filter((item) => item.id !== id)
    .map((item) =>
      item.children
        ? { ...item, children: deleteItem(item.children, id) }
        : item
    );

const getAllFiles = (items: FileSystemItem[]): FileSystemItem[] => {
  let results: FileSystemItem[] = [];
  for (const item of items) {
    if (item.type === "file") results.push(item);
    if (item.children) results = results.concat(getAllFiles(item.children));
  }
  return results;
};

/* ---------- Types ---------- */
type ClientIdeShellProps = {
  id: string; // URL param (string)
};

type LeftPanelTab = "chat" | "filetree";

/* ---------- Component ---------- */
export default function ClientIdeShell({ id }: ClientIdeShellProps) {
  const [activeTab, setActiveTab] = useState<LeftPanelTab>("chat");

  /** 🔑 핵심: URL param → number 변환 (여기서 끝냄) */
  const numericContainerId = Number(id);

  const [files, setFiles] = useState<FileSystemItem[]>([
    {
      id: "1",
      name: "script.js",
      type: "file",
      content: `console.log('Hello, JavaScript!');`,
    },
    {
      id: "2",
      name: "main.py",
      type: "file",
      content: `print("Hello from Python")`,
    },
    {
      id: "3",
      name: "Main.java",
      type: "file",
      content: `public class Main {}`,
    },
  ]);

  const [activeId, setActiveId] = useState<string | undefined>("1");
  const [activeTerminalTab, setActiveTerminalTab] = useState("TERMINAL");
  const [runOutput, setRunOutput] = useState<string[]>([]);
  const [debugOutput, setDebugLogs] = useState<string[]>([]);

  const activeItem = useMemo(
    () => (activeId ? findItem(files, activeId) : undefined),
    [files, activeId]
  );

  const allFiles = useMemo(() => getAllFiles(files), [files]);

  /* ---------- Handlers ---------- */
  const handleSelect = (item: FileSystemItem) => {
    if (item.type === "file") {
      setActiveId(item.id);
    } else {
      setFiles((prev) =>
        updateItem(prev, item.id, (i) => ({ ...i, isOpen: !i.isOpen }))
      );
    }
  };

  const handleContentChange = (value: string) => {
    if (!activeId) return;
    setFiles((prev) =>
      updateItem(prev, activeId, (item) => ({ ...item, content: value }))
    );
  };

  /* ---------- UI ---------- */
  const EditorTabs = (
    <div className="flex bg-[#0d1117] border-b border-[#2d333b] overflow-x-auto">
      {allFiles.map((file) => (
        <div
          key={file.id}
          onClick={() => setActiveId(file.id)}
          className={`px-3 py-2 text-sm cursor-pointer border-r border-[#2d333b]
            ${
              activeId === file.id
                ? "bg-[#1f2428] text-white"
                : "text-gray-400"
            }`}
        >
          {file.name}
        </div>
      ))}
    </div>
  );

  return (
    <main className="h-screen w-screen bg-[#0B1020] text-white flex">
      {/* Left Icon Bar */}
      <div className="w-12 bg-[#0E1325] border-r border-white/10 flex flex-col items-center py-3 gap-4">
        <button onClick={() => setActiveTab("chat")}>
          <MessageSquare size={20} />
        </button>
        <button onClick={() => setActiveTab("filetree")}>
          <FolderTree size={20} />
        </button>
      </div>

      {/* Main */}
      <div className="flex-1 min-w-0">
        <SplitLayout
          sidebar={
            <div className="h-full bg-[#12182B]">
              {activeTab === "chat" && (
                <ChatPanel containerId={numericContainerId} />
              )}
              {activeTab === "filetree" && (
                <FileSidebar
                  files={files}
                  activeId={activeId}
                  onSelect={handleSelect}
                />
              )}
            </div>
          }
          editorTabs={EditorTabs}
          editor={
            activeItem && activeItem.type === "file" ? (
              <MonacoEditor
                file={{
                  name: activeItem.name,
                  content: activeItem.content || "",
                }}
                onChange={handleContentChange}
                onRun={() => {}}
                onDebug={() => {}}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                Select a file
              </div>
            )
          }
          terminal={
            <TerminalPanel
              activeTab={activeTerminalTab}
              onTabChange={setActiveTerminalTab}
              outputLogs={runOutput}
              debugLogs={debugOutput}
            />
          }
        />
      </div>
    </main>
  );
}
