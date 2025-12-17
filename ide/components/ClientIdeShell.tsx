"use client";

import { useState, useMemo } from "react";
import { MessageSquare, FolderTree } from "lucide-react";

import ChatPanel from "@/app/ide/components/chat/ChatPanel";
// We don't need the old FileTree or Editor anymore
// import FileTree from "@/app/ide/components/filetree/FileTree"; 
// import Editor from "@/app/ide/components/editor/Editor";

// WebIC Imports
import SplitLayout from "@/webic_ide_terminal/components/ui/SplitLayout";
import FileSidebar from "@/webic_ide_terminal/components/files/FileSidebar";
import MonacoEditor from "@/webic_ide_terminal/components/editor/MonacoEditor";
import TerminalPanel from "@/webic_ide_terminal/components/terminal/TerminalPanel";
import { initialFiles } from "@/webic_ide_terminal/styles/theme";
import type { FileSystemItem } from "@/webic_ide_terminal/types/fileTypes";

// --- Helper Functions (from WebICEditor) ---
const findItem = (items: FileSystemItem[], id: string): FileSystemItem | undefined => {
  for (const item of items) {
    if (item.id === id) return item
    if (item.children) {
      const found = findItem(item.children, id)
      if (found) return found
    }
  }
  return undefined
}

const updateItem = (items: FileSystemItem[], id: string, updater: (item: FileSystemItem) => FileSystemItem): FileSystemItem[] => {
  return items.map(item => {
    if (item.id === id) {
      return updater(item)
    }
    if (item.children) {
      return { ...item, children: updateItem(item.children, id, updater) }
    }
    return item
  })
}

const deleteItem = (items: FileSystemItem[], id: string): FileSystemItem[] => {
  return items.filter(item => item.id !== id).map(item => {
    if (item.children) {
      return { ...item, children: deleteItem(item.children, id) }
    }
    return item
  })
}

const getAllFiles = (items: FileSystemItem[]): FileSystemItem[] => {
  let results: FileSystemItem[] = []
  for (const item of items) {
    if (item.type === 'file') {
      results.push(item)
    }
    if (item.children) {
      results = results.concat(getAllFiles(item.children))
    }
  }
  return results
}

type ClientIdeShellProps = {
  id: string; // Used for ChatPanel
};

type LeftPanelTab = "chat" | "filetree";

export default function ClientIdeShell({ id }: ClientIdeShellProps) {
  const [activeTab, setActiveTab] = useState<LeftPanelTab>("chat");

  // --- WebIC State ---
  // Adapted example files to FileSystemItem structure
  const [files, setFiles] = useState<FileSystemItem[]>([
    {
      id: '1',
      name: 'script.js',
      type: 'file',
      content: `// JavaScript Code
console.log('Hello, JavaScript!');
for (let i = 0; i < 3; i++) {
  console.log('Count:', i);
}`
    },
    {
      id: '2',
      name: 'main.py',
      type: 'file',
      content: `# Python Code Example
def greet(name):
    return f"Hello, {name} from Python!"

print(greet("WebIC"))
for i in range(3):
    print(f"Count: {i}")`
    },
    {
      id: '3',
      name: 'Main.java',
      type: 'file',
      content: `// Java Code Example
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java from WebIC!");
        for (int i = 0; i < 3; i++) {
            System.out.println("Count: " + i);
        }
    }
}`
    }
  ])
  const [activeId, setActiveId] = useState<string | undefined>('1')
  const [activeTerminalTab, setActiveTerminalTab] = useState('TERMINAL')
  const [runOutput, setRunOutput] = useState<string[]>([])
  const [debugOutput, setDebugLogs] = useState<string[]>([])

  const activeItem = useMemo(() => activeId ? findItem(files, activeId) : undefined, [files, activeId])
  const allFiles = useMemo(() => getAllFiles(files), [files])

  // --- WebIC Handlers ---
  const handleSelect = (item: FileSystemItem) => {
    if (item.type === 'file') {
      setActiveId(item.id)
    } else {
      setFiles(prev => updateItem(prev, item.id, (i) => ({ ...i, isOpen: !i.isOpen })))
    }
  }

  const handleContentChange = (value: string) => {
    if (!activeId) return
    setFiles((prev) => updateItem(prev, activeId, (item) => ({ ...item, content: value })))
  }

  const handleAddFile = (parentId?: string) => {
    const newId = `file-${Date.now()}`
    const newFile: FileSystemItem = {
      id: newId,
      name: `new-${allFiles.length + 1}.txt`,
      type: 'file',
      content: '',
    }

    if (!parentId) {
      setFiles((prev) => [...prev, newFile])
    } else {
      setFiles((prev) => updateItem(prev, parentId, (folder) => ({
        ...folder,
        isOpen: true,
        children: [...(folder.children || []), newFile]
      })))
    }
    setActiveId(newId)
  }

  const handleAddFolder = (parentId?: string) => {
    const newId = `folder-${Date.now()}`
    const newFolder: FileSystemItem = {
      id: newId,
      name: `folder-${Date.now()}`,
      type: 'folder',
      children: [],
      isOpen: true
    }

    if (!parentId) {
      setFiles((prev) => [...prev, newFolder])
    } else {
      setFiles((prev) => updateItem(prev, parentId, (folder) => ({
        ...folder,
        isOpen: true,
        children: [...(folder.children || []), newFolder]
      })))
    }
  }

  const handleDeleteFile = (fileId: string) => {
    setFiles((prev) => {
      const next = deleteItem(prev, fileId)
      if (activeId === fileId) {
        const remaining = getAllFiles(next)
        setActiveId(remaining.length > 0 ? remaining[0].id : undefined)
      } else if (activeId && !findItem(next, activeId)) {
        const remaining = getAllFiles(next)
        setActiveId(remaining.length > 0 ? remaining[0].id : undefined)
      }
      return next
    })
  }

  const handleRenameFile = (fileId: string, newName: string) => {
    setFiles((prev) => updateItem(prev, fileId, (item) => ({ ...item, name: newName })))
  }

  // === 1. JavaScript 실행 로직 (브라우저 내 실제 실행) ===
  const executeJS = (code: string) => {
    const capturedLogs: string[] = []
    // Use built-in Console parameter tuples so we avoid eslint's no-explicit-any rule.
    const mockConsole = {
      log: (...args: Parameters<Console["log"]>) => {
        capturedLogs.push(args.map(a =>
          typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)
        ).join(' '))
      },
      error: (...args: Parameters<Console["error"]>) => capturedLogs.push(`[ERROR] ${args.join(' ')}`),
      warn: (...args: Parameters<Console["warn"]>) => capturedLogs.push(`[WARN] ${args.join(' ')}`),
      info: (...args: Parameters<Console["info"]>) => capturedLogs.push(`[INFO] ${args.join(' ')}`),
    }

    try {
      capturedLogs.push('> Executing JS...')
      const run = new Function('console', code)
      run(mockConsole)
      capturedLogs.push('> Exited with code 0')
    } catch (err) {
      capturedLogs.push(`> Runtime Error: ${err instanceof Error ? err.message : String(err)}`)
    }
    return capturedLogs
  }

  // === 2. Python/Java 실행 시뮬레이션 (Mock) ===
  const simulateExecution = (code: string, lang: string) => {
    return [
      `> Executing ${lang}...`,
      `[Mock Output] Hello, ${lang} from WebIC!`,
      `[Mock Output] Count: 0`,
      `[Mock Output] Count: 1`,
      `[Mock Output] Count: 2`,
      `> Exited with code 0`,
      `(참고: 실제 ${lang} 실행을 위해서는 백엔드 서버가 필요합니다)`
    ]
  }

  const handleRun = (content: string) => {
    setActiveTerminalTab('OUTPUT')

    const fileName = activeItem?.name || ''
    let logs: string[] = []

    if (fileName.endsWith('.js') || fileName.endsWith('.ts') || fileName.endsWith('.tsx')) {
      logs = executeJS(content)
    } else if (fileName.endsWith('.py')) {
      logs = simulateExecution(content, 'python')
    } else if (fileName.endsWith('.java')) {
      logs = simulateExecution(content, 'java')
    } else {
      logs = [`> ${fileName.split('.').pop()} 언어 실행은 아직 지원되지 않습니다.`]
    }

    setRunOutput(logs)
  }

  const handleDebug = (content: string) => {
    setActiveTerminalTab('DEBUG CONSOLE')
    const fileName = activeItem?.name || ''
    const snippet = content ? `${content.slice(0, 120)}${content.length > 120 ? "..." : ""}` : "<empty>"
    // Include the passed content so the handler output reflects the actual code being debugged.
    setDebugLogs([
      `> Starting Debugger for ${fileName}...`,
      `> Snapshot: ${snippet}`,
      '> Breakpoint hit at line 1',
      '> Variable state: { i: 0 }',
      '> Debugging session ended.',
    ])
  }

  const activeFileForEditor = activeItem && activeItem.type === 'file' ? {
    name: activeItem.name,
    content: activeItem.content || ''
  } : { name: '', content: '' }

  // --- Components ---
  const EditorTabs = (
    <div className="flex bg-[#0d1117] border-b border-[#2d333b] overflow-x-auto">
      {allFiles.map(file => (
        <div
          key={file.id}
          onClick={() => setActiveId(file.id)}
          className={`
          px-3 py-2 text-sm cursor-pointer border-r border-[#2d333b] max-w-[150px] truncate select-none
          ${activeId === file.id ? 'bg-[#1f2428] text-[#e6edf3] border-t-2 border-t-[#f78166]' : 'text-[#8b949e] hover:bg-[#161b22]'}
        `}
        >
          {file.name}
        </div>
      ))}
    </div>
  )

  return (
    <main className="h-screen w-screen bg-[#0B1020] text-white flex gap-2">
      {/* Left Sidebar (Activity Bar) */}
      <div className="w-12 bg-[#0E1325] border-r border-white/10 flex flex-col items-center py-3 gap-4 z-10 shrink-0">
        <button
          onClick={() => setActiveTab("chat")}
          className={`p-2 rounded transition
            ${activeTab === "chat"
              ? "text-indigo-400 bg-white/10"
              : "text-gray-400 hover:text-white"
            }`}
        >
          <MessageSquare size={20} />
        </button>

        <button
          onClick={() => setActiveTab("filetree")}
          className={`p-2 rounded transition
            ${activeTab === "filetree"
              ? "text-indigo-400 bg-white/10"
              : "text-gray-400 hover:text-white"
            }`}
        >
          <FolderTree size={20} />
        </button>
      </div>

      {/* SplitLayout serves as the main container area to the right of the icon bar */}
      <div className="flex-1 min-w-0">
        <SplitLayout
          sidebar={
            <div className="h-full bg-[#12182B]">
              {activeTab === "chat" && <ChatPanel containerId={id} />}
              {activeTab === "filetree" && (
                <FileSidebar
                  files={files}
                  activeId={activeId}
                  onSelect={handleSelect}
                  onAddFile={handleAddFile}
                  onAddFolder={handleAddFolder}
                  onDeleteFile={handleDeleteFile}
                  onRenameFile={handleRenameFile}
                />
              )}
            </div>
          }
          editorTabs={EditorTabs}
          editor={
            activeItem && activeItem.type === 'file' ? (
              <MonacoEditor
                file={activeFileForEditor}
                onChange={handleContentChange}
                onRun={handleRun}
                onDebug={handleDebug}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-[#6e7681]">
                Select a file to edit
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
