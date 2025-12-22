"use client";

import { useMemo, useState } from "react";
import MonacoEditor from "./MonacoEditor";
import TerminalPanel, { Problem } from "../terminal/TerminalPanel";
import FileSidebar from "../filetree/FileSidebar";
import { WebICContextProvider, useWebIC } from "@/app/ide/contexts/WebICContext";

// Internal Component using Context
const WebICEditorContent = () => {
  const { activeFile, updateFileContent, activeId, containerId } = useWebIC();

  const [problems, setProblems] = useState<Problem[]>([]);
  const [activeTerminalTab, setActiveTerminalTab] = useState("TERMINAL");
  const [runOutput, setRunOutput] = useState<string[]>([]);
  const [debugOutput, setDebugOutput] = useState<string[]>([]);

  const isRunnable = (filename: string) => {
    return /\.(js|jsx|ts|tsx)$/.test(filename);
  };

  const handleRun = async (content: string) => {
    setActiveTerminalTab("OUTPUT");
    setProblems([]);

    if (!activeFile) return;

    if (!isRunnable(activeFile.name)) {
      setRunOutput([
        `⚠️ [Info] '${activeFile.name}' 파일은 실행할 수 없는 형식입니다.`,
        `   현재 JavaScript/TypeScript 실행만 지원합니다.`
      ]);
      return;
    }

    // --- 1단계: 브라우저 로컬 실행 (eval) 시도 ---
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (...args: unknown[]) => {
      logs.push(args.map(arg =>
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' '));
    };

    try {
      // eslint-disable-next-line react-hooks/unsupported-syntax
      eval(content);
      // 로컬 실행 성공 시 출력
      setRunOutput(logs.length > 0 ? logs : ['✅ [Local] 실행 완료']);
    } catch (localError) {
      // --- 2단계: 로컬 실행 실패 시 서버 사이드 실행 시도 ---
      console.log = originalLog; // 원래 콘솔 복원

      setRunOutput([
        `⚠️ [Local] 실행 중 에러가 발생하여 서버에서 실행을 시도합니다...`,
        `❌ Error: ${localError instanceof Error ? localError.message : String(localError)}`,
        `⏳ 서버 사이드 실행 중...`
      ]);

      try {
        const type = activeFile.name.endsWith('.ts') || activeFile.name.endsWith('.tsx') ? 'typescript' : 'javascript';
        const res = await fetch('https://api.webicapp.com/code/run', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            path: activeFile.name,
            type: type
          })
        });

        if (res.ok) {
          const data = await res.json();
          setRunOutput(prev => [...prev, `🌐 [Server] 실행 결과:`, data.description || '실행 완료']);
        } else {
          setRunOutput(prev => [...prev, `❌ [Server] 실행 실패 (Status: ${res.status})`]);
        }
      } catch (serverError: unknown) {
        const errorMessage = serverError instanceof Error ? serverError.message : String(serverError);
        setRunOutput(prev => [...prev, `❌ [Server] Error: ${errorMessage}`]);
        setProblems([{
          message: errorMessage,
          source: 'Server Runtime',
          severity: 'error'
        }]);
        setActiveTerminalTab("PROBLEMS");
      }
    } finally {
      console.log = originalLog; // 안전하게 원래 콘솔 복원
    }
  };

  const handleDebug = async (content: string) => {
    setActiveTerminalTab("DEBUG CONSOLE");
    setProblems([]);

    if (!activeFile) return;

    if (!isRunnable(activeFile.name)) {
      setDebugOutput([
        `⚠️ [Info] '${activeFile.name}' 파일은 디버깅할 수 없습니다.`,
        `   현재 JavaScript/TypeScript 디버깅만 지원합니다.`
      ]);
      return;
    }

    // --- 1단계: 브라우저 로컬 디버그 시도 ---
    const logs: string[] = ['🐛 [Local] Debug Mode'];
    const originalLog = console.log;
    console.log = (...args: unknown[]) => {
      logs.push(args.map(arg =>
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' '));
    };

    try {
      // eslint-disable-next-line react-hooks/unsupported-syntax
      eval(content);
      setDebugOutput(logs);
    } catch (localError) {
      // --- 2단계: 로컬 디버그 실패 시 서버 사이드 시도 ---
      console.log = originalLog;

      setDebugOutput(prev => [
        ...prev,
        `⚠️ [Local] 디버깅 중 에러 발생, 서버 실행 시도...`,
        `❌ Error: ${localError instanceof Error ? localError.message : String(localError)}`
      ]);

      try {
        const type = activeFile.name.endsWith('.ts') || activeFile.name.endsWith('.tsx') ? 'typescript' : 'javascript';
        const res = await fetch('https://api.webicapp.com/code/run', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            path: activeFile.name,
            type: type
          })
        });

        if (res.ok) {
          const data = await res.json();
          setDebugOutput(prev => [...prev, `🌐 [Server] Debug Result:`, data.description || '실행 완료']);
        } else {
          setDebugOutput(prev => [...prev, `❌ [Server] 디버그 실행 실패 (Status: ${res.status})`]);
        }
      } catch (serverError: unknown) {
        const errorMessage = serverError instanceof Error ? serverError.message : String(serverError);
        setDebugOutput(prev => [...prev, `❌ [Server] Error: ${errorMessage}`]);
        setProblems([{
          message: errorMessage,
          source: 'Server Debug',
          severity: 'error'
        }]);
        setActiveTerminalTab("PROBLEMS");
      }
    } finally {
      console.log = originalLog;
    }
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
