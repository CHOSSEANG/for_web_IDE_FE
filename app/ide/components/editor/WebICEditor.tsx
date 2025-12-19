"use client";

import { useState, useMemo } from "react";
import MonacoEditor from "./MonacoEditor";
import TerminalPanel from "../terminal/TerminalPanel";
import FileSidebar from "../filetree/FileSidebar";
import type { FileSystemItem } from "../../types/fileTypes";

import { initialFiles } from "@/app/ide/lib/workspaceFiles";

// Helper functions (same as EditorPage.tsx but could be moved to utils)
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
): FileSystemItem[] => {
  return items.map((item) => {
    if (item.id === id) {
      return updater(item);
    }
    if (item.children) {
      return { ...item, children: updateItem(item.children, id, updater) };
    }
    return item;
  });
};

const deleteItem = (items: FileSystemItem[], id: string): FileSystemItem[] => {
  return items
    .filter((item) => item.id !== id)
    .map((item) => {
      if (item.children) {
        return { ...item, children: deleteItem(item.children, id) };
      }
      return item;
    });
};

const getAllFiles = (items: FileSystemItem[]): FileSystemItem[] => {
  let results: FileSystemItem[] = [];
  for (const item of items) {
    if (item.type === "file") {
      results.push(item);
    }
    if (item.children) {
      results = results.concat(getAllFiles(item.children));
    }
  }
  return results;
};

const WebICEditor = () => {
  const [files, setFiles] = useState<FileSystemItem[]>(initialFiles);
  const [activeId, setActiveId] = useState<string | undefined>("root-welcome");
  const [activeTerminalTab, setActiveTerminalTab] = useState("TERMINAL");
  const [runOutput, setRunOutput] = useState<string[]>([]);
  const [debugOutput, setDebugOutput] = useState<string[]>([]);

  const activeItem = useMemo(
    () => (activeId ? findItem(files, activeId) : undefined),
    [files, activeId]
  );

  const handleContentChange = (value: string) => {
    if (!activeId) return;
    setFiles((prev) =>
      updateItem(prev, activeId, (item) => ({ ...item, content: value }))
    );
  };

  const handleRun = (content: string) => {
    setActiveTerminalTab("OUTPUT");
    setRunOutput([content]);
  };

  const handleDebug = (content: string) => {
    setActiveTerminalTab("DEBUG CONSOLE");
    setDebugOutput(["Debug:", content]);
  };

  const activeFile =
    activeItem && activeItem.type === "file"
      ? { name: activeItem.name, content: activeItem.content || "" }
      : null;

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 min-h-0">
        {activeFile ? (
          <MonacoEditor
            file={activeFile}
            onChange={handleContentChange}
            onRun={handleRun}
            onDebug={handleDebug}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a file to edit
          </div>
        )}
      </div>

      <div className="h-[240px] border-t border-white/10">
        <TerminalPanel
          activeTab={activeTerminalTab}
          onTabChange={setActiveTerminalTab}
          outputLogs={runOutput}
          debugLogs={debugOutput}
        />
      </div>
    </div>
  );
};

/** 🔑 Left Panel 전용 */
WebICEditor.LeftPanel = function LeftPanel() {
  const [files, setFiles] = useState<FileSystemItem[]>(initialFiles);
  const [activeId, setActiveId] = useState<string | undefined>();

  return (
    <FileSidebar
      files={files}
      activeId={activeId}
      onSelect={(item) => item.type === "file" && setActiveId(item.id)}
    />
  );
};

/** 🔑 Main Editor */
WebICEditor.Main = WebICEditor;

export default WebICEditor;
