"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import MonacoEditor from "./MonacoEditor";
import TerminalPanel, { Problem } from "../terminal/TerminalPanel";
import FileSidebar from "../filetree/FileSidebar";
import { WebICContextProvider, useWebIC } from "@/app/ide/contexts/WebICContext";

// Internal Component using Context
const WebICEditorContent = () => {
  const API_BASE_URL = '/api-proxy';
  const { getToken } = useAuth();
  const { activeFile, updateFileContent, saveFileContent } = useWebIC();

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

    // --- 실행 전 서버 저장 (파일 내용 & 코딩 시간 통합 전송) ---
    await saveFileContent(content);

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
    } catch (localError: unknown) {
      // --- 2단계: 로컬 실행 실패 시 서버 사이드 실행 시도 ---
      console.log = originalLog; // 원래 콘솔 복원

      const localErrorMessage = localError instanceof Error ? localError.message : String(localError);

      // Problems 탭에 로컬 에러 추가
      setProblems([{
        message: localErrorMessage,
        source: 'Local Runtime',
        severity: 'error'
      }]);
      setActiveTerminalTab("PROBLEMS");

      setRunOutput([
        `⚠️ [Local] 실행 중 에러가 발생하여 서버에서 실행을 시도합니다...`,
        `❌ Error: ${localErrorMessage}`,
        `⏳ 서버 사이드 실행 중...`
      ]);

      try {
        const type = activeFile.name.endsWith('.ts') || activeFile.name.endsWith('.tsx') ? 'typescript' : 'javascript';
        const token = await getToken();
        const res = await fetch(`${API_BASE_URL}/code/run`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            path: activeFile.name,
            type: type,
            lang: type
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
        setProblems(prev => [...prev, {
          message: errorMessage,
          source: 'Server Runtime',
          severity: 'error'
        }]);
      }
    } finally {
      console.log = originalLog; // 안전하게 원래 콘솔 복원
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
    } catch (localError: unknown) {
      // --- 2단계: 로컬 디버그 실패 시 서버 사이드 시도 ---
      console.log = originalLog;

      const localErrorMessage = localError instanceof Error ? localError.message : String(localError);

      setProblems([{
        message: localErrorMessage,
        source: 'Local Debug',
        severity: 'error'
      }]);
      setActiveTerminalTab("PROBLEMS");

      setDebugOutput(prev => [
        ...prev,
        `⚠️ [Local] 디버깅 중 에러 발생, 서버 실행 시도...`,
        `❌ Error: ${localErrorMessage}`
      ]);

      try {
        const type = activeFile.name.endsWith('.ts') || activeFile.name.endsWith('.tsx') ? 'typescript' : 'javascript';
        const token = await getToken();
        // 현재는 단일 파일 실행 기준
        const res = await fetch(`${API_BASE_URL}/code/run`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            path: activeFile.name,
            type: type,
            lang: type
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
        setProblems(prev => [...prev, {
          message: errorMessage,
          source: 'Server Debug',
          severity: 'error'
        }]);
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
