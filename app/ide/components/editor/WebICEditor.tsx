"use client";

import { useMemo, useState } from "react";
import MonacoEditor from "./MonacoEditor";
import TerminalPanel, { Problem } from "../terminal/TerminalPanel";
import FileSidebar from "../filetree/FileSidebar";
import { WebICContextProvider, useWebIC } from "@/app/ide/contexts/WebICContext";

// Internal Component using Context
const WebICEditorContent = () => {
  const { activeFile, updateFileContent, activeId } = useWebIC();

  const [problems, setProblems] = useState<Problem[]>([]);
  const [activeTerminalTab, setActiveTerminalTab] = useState("TERMINAL");
  const [runOutput, setRunOutput] = useState<string[]>([]);
  const [debugOutput, setDebugOutput] = useState<string[]>([]);

  const isRunnable = (filename: string) => {
    return /\.(js|jsx|ts|tsx)$/.test(filename);
  };

  const handleRun = (content: string) => {
    setActiveTerminalTab("OUTPUT");
    setProblems([]); // 초기화

    // 실행 가능한 언어인지 확인
    if (activeFile && !isRunnable(activeFile.name)) {
      setRunOutput([
        `⚠️ [Info] '${activeFile.name}' 파일은 브라우저에서 실행할 수 없습니다.`,
        `   WebIC는 현재 JavaScript/TypeScript 실행만 지원합니다.`
      ]);
      return;
    }

    const logs: string[] = [];
    const originalLog = console.log;

    // console.log 오버라이딩
    console.log = (...args: unknown[]) => {
      logs.push(args.map(arg =>
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' '));
    };

    try {
      // 코드 실행
      // eslint-disable-next-line react-hooks/unsupported-syntax
      eval(content);
      setRunOutput(logs.length > 0 ? logs : ['실행 완료']);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setRunOutput([`❌ Error: ${errorMessage}`]);
      setProblems([{
        message: errorMessage,
        source: 'Runtime',
        severity: 'error'
      }]);
      setActiveTerminalTab("PROBLEMS"); // 에러 발생 시 Problems 탭으로 이동
    } finally {
      // 원래 console.log 복원
      console.log = originalLog;
    }
  };

  const handleDebug = (content: string) => {
    setActiveTerminalTab("DEBUG CONSOLE");
    setProblems([]); // 초기화

    // 실행 가능한 언어인지 확인
    if (activeFile && !isRunnable(activeFile.name)) {
      setDebugOutput([
        `⚠️ [Info] '${activeFile.name}' 파일은 브라우저에서 디버깅할 수 없습니다.`,
        `   WebIC는 현재 JavaScript/TypeScript 디버깅만 지원합니다.`
      ]);
      return;
    }

    const logs: string[] = [];
    const originalLog = console.log;

    // console.log 오버라이딩
    console.log = (...args: unknown[]) => {
      logs.push(args.map(arg =>
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' '));
    };

    try {
      // 디버그 모드로 실행
      logs.push('🐛 Debug Mode');
      // eslint-disable-next-line react-hooks/unsupported-syntax
      eval(content);
      setDebugOutput(logs);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setDebugOutput([...logs, `❌ Error: ${errorMessage}`]);
      setProblems([{
        message: errorMessage,
        source: 'Debug',
        severity: 'error'
      }]);
      setActiveTerminalTab("PROBLEMS"); // 에러 발생 시 Problems 탭으로 이동
    } finally {
      // 원래 console.log 복원
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
  // LeftPanel needs to use the SAME context. 
  // IMPORTANT: Context only works if LeftPanel is also under the Provider.
  // However, in ClientIdeShell, LeftPanel and Main are rendered as siblings.
  // If ClientIdeShell doesn't wrap both with Provider, they will have separate states (or fail if we enforce provider).
  // Let's modify ClientIdeShell to hold the Provider, OR create a global Provider wrapper component exported from here.

  // BUT since we are keeping the file structure, we probably rely on ClientIdeShell to wrap them, or we export the Provider.
  // Currently ClientIdeShell renders <WebICEditor.LeftPanel> and <WebICEditor.Main>.
  // If we want them to share state, ClientIdeShell MUST be the one wrapping them with Provider.

  // For now, let's assume we will update ClientIdeShell to wrap everything.
  // Here we just define the component consuming the context.
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
