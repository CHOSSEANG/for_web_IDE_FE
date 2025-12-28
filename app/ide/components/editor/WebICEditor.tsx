"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import MonacoEditor from "./MonacoEditor";
import TerminalPanel, { Problem } from "../terminal/TerminalPanel";
import FileSidebar from "../filetree/FileSidebar";
import { WebICContextProvider, useWebIC } from "@/app/ide/contexts/WebICContext";

// Internal Component using Context
const WebICEditorContent = () => {
  const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}`;
  const { getToken } = useAuth();
  const { activeFile, containerId, updateFileContent, saveFileContent } = useWebIC();

  const [problems, setProblems] = useState<Problem[]>([]);
  const [activeTerminalTab, setActiveTerminalTab] = useState("TERMINAL");
  const [runOutput, setRunOutput] = useState<string[]>([]);
  const [debugOutput, setDebugOutput] = useState<string[]>([]);

  const isRunnable = (filename: string) => {
    return /\.(js|jsx|ts|tsx|java|py)$/.test(filename);
  };

  const handleRun = async (content: string) => {
    setActiveTerminalTab("OUTPUT");
    setProblems([]);

    if (!activeFile) return;

    // --- 실행 전 서버 저장 (파일 내용 & 코딩 시간 통합 전송) ---
    await saveFileContent(content);

    if (!isRunnable(activeFile.name)) {
      setRunOutput([
        `⚠️ [Info] '${activeFile.name}' 파일은 실행할 수 없는 형식입니다.`,
        `   현재 JavaScript/TypeScript/Java/Python 실행만 지원합니다.`
      ]);
      return;
    }

    setRunOutput([`⏳ 서버에서 ${activeFile.name} 실행 중...`]);

    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE_URL}/code/${containerId}/${activeFile.serverId}/run`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setRunOutput(prev => [...prev, `🌐 [Server] 실행 결과:`, data.data.result || '실행 완료']);
      } else {
        setRunOutput(prev => [...prev, `❌ [Server] 실행 실패 (Status: ${res.status})`]);
      }
    } catch (serverError: unknown) {
      const errorMessage = serverError instanceof Error ? serverError.message : String(serverError);
      setRunOutput(prev => [...prev, `❌ [Server] Error: ${errorMessage}`]);
      setProblems(prev => [...prev, {
        message: errorMessage,
        source: 'Server Runtime',
        severity: 'error'
      }]);
    }
  };

  const handleDebug = async (content: string) => {
    setActiveTerminalTab("DEBUG CONSOLE");
    setProblems([]);

    if (!activeFile) return;

    // --- 디버그 전 서버 저장 (파일 내용 & 코딩 시간 통합 전송) ---
    await saveFileContent(content);

    if (!isRunnable(activeFile.name)) {
      setDebugOutput([
        `⚠️ [Info] '${activeFile.name}' 파일은 디버깅할 수 없습니다.`,
        `   현재 JavaScript/TypeScript/Java/Python 실행만 지원합니다.`
      ]);
      return;
    }

    setDebugOutput([`🐛 서버에서 ${activeFile.name} 디버깅 중...`]);

    try {
      const token = await getToken();
      // 현재는 단일 파일 실행 기준
      const res = await fetch(`${API_BASE_URL}/code/${containerId}/${activeFile.serverId}/run`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setDebugOutput(prev => [...prev, `🌐 [Server] Debug Result:`, data.data.result || '실행 완료']);
      } else {
        setDebugOutput(prev => [...prev, `❌ [Server] 디버그 실행 실패 (Status: ${res.status})`]);
      }
    } catch (serverError: unknown) {
      const errorMessage = serverError instanceof Error ? serverError.message : String(serverError);
      setDebugOutput(prev => [...prev, `❌ [Server] Error: ${errorMessage}`]);
      setProblems(prev => [...prev, {
        message: errorMessage,
        source: 'Server Debug',
        severity: 'error'
      }]);
    }
  };

  const handleSave = async (content: string) => {
    if (!activeFile) return;
    await saveFileContent(content);
    setActiveTerminalTab("OUTPUT");
    setRunOutput([`✅ 파일 저장 완료: ${activeFile.name}`]);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 min-h-0">
        {activeFile ? (
          <MonacoEditor
            file={activeFile}
            onChange={updateFileContent}
            onRun={handleRun}
            onDebug={handleDebug}
            onSave={handleSave}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-text-muted">
            Select a file to edit
          </div>
        )}
      </div>

      <div className="h-[240px] border-t border-border-light">
        <TerminalPanel
          activeTab={activeTerminalTab}
          onTabChange={setActiveTerminalTab}
          outputLogs={runOutput}
          debugLogs={debugOutput}
          problemLogs={problems}
        />
      </div>
    </div>
  );
};

// Root Component Wrapper
const WebICEditor = () => {
  return (
    <WebICContextProvider>
      <WebICEditorContent />
    </WebICContextProvider>
  )
}

/** 🔑 Left Panel 전용 */
WebICEditor.LeftPanel = function LeftPanel() {
  const {
    files,
    activeId,
    setActiveId,
    addFile,
    addFolder,
    deleteItem,
    renameItem
  } = useWebIC();

  return (
    <FileSidebar
      files={files}
      activeId={activeId}
      onSelect={(item) => item.type === "file" && setActiveId(item.id)}
      onAddFile={addFile}
      onAddFolder={addFolder}
      onDeleteFile={deleteItem}
      onRenameFile={renameItem}
    />
  );
};

/** 🔑 Main Editor */
WebICEditor.Main = WebICEditorContent; // Exporting Content, assuming wrapped by Shell

export default WebICEditor;
