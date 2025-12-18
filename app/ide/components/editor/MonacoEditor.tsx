'use client'

import { Editor } from '@monaco-editor/react'
import { useEffect, useState, useRef } from 'react'
import Timer from './Timer'

interface MonacoEditorProps {
    file: {
        name: string
        content: string
        language?: string
    }
    onChange?: (value: string) => void
    onRun?: (code: string) => void
    onDebug?: (code: string) => void
}

const MonacoEditor = ({ file, onChange, onRun, onDebug }: MonacoEditorProps) => {
    const [isRunning, setIsRunning] = useState(false)
    const editorRef = useRef<any>(null)
    const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    const handleEditorDidMount = (editor: any) => {
        editorRef.current = editor
    }

    const getLanguage = (filename: string) => {
        if (filename.endsWith('.css')) return 'css'
        if (filename.endsWith('.json')) return 'json'
        if (filename.endsWith('.html')) return 'html'
        if (filename.endsWith('.js') || filename.endsWith('.jsx')) return 'javascript'
        if (filename.endsWith('.ts') || filename.endsWith('.tsx')) return 'typescript'
        if (filename.endsWith('.java')) return 'java'
        if (filename.endsWith('.py')) return 'python'
        return 'plaintext'
    }

    // Triggered when typing
    const handleEditorChange = (value: string | undefined) => {
        onChange?.(value || '')

        // Activate "Working" state
        setIsRunning(true)

        // Reset the idle timeout
        if (idleTimeoutRef.current) {
            clearTimeout(idleTimeoutRef.current)
        }

        // Set back to "Idle" after 2 seconds of inactivity
        idleTimeoutRef.current = setTimeout(() => {
            setIsRunning(false)
        }, 2000)
    }

    const handleRun = () => {
        // UI 상태 변경을 먼저 수행 (조건문 밖으로)
        setIsRunning(true)

        // Reset idle timeout
        if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current)
        idleTimeoutRef.current = setTimeout(() => setIsRunning(false), 2000)

        // 실제 실행 로직
        if (onRun) {
            const code = editorRef.current ? editorRef.current.getValue() : file.content
            onRun(code)
        }
    }

    const handleDebug = () => {
        // UI 상태 변경을 먼저 수행
        setIsRunning(true)

        // Reset idle timeout
        if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current)
        idleTimeoutRef.current = setTimeout(() => setIsRunning(false), 2000)

        // 실제 디버그 로직
        if (onDebug) {
            const code = editorRef.current ? editorRef.current.getValue() : file.content
            onDebug(code)
        }
    }

    return (
        <div className="h-full flex flex-col bg-[#0d1117] text-[#e6edf3]">
            {/* Toolbar */}
            {/* Toolbar (Timer Bar) */}
            <div className={`
                flex justify-between items-center px-4 py-2 gap-4 
                border-b border-[#333] bg-[#0d1117] overflow-hidden
                font-mono font-bold transition-colors duration-300
                ${isRunning ? 'text-[#4caf50]' : 'text-[#8b949e]'}
            `}>
                {/* Left Controls */}
                <div className="flex items-center gap-2 min-w-0 shrink overflow-hidden">
                    <button
                        onClick={handleRun}
                        className="flex items-center gap-2 px-3 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white rounded text-sm font-medium transition-colors whitespace-nowrap font-sans"
                    >
                        <span className="text-lg leading-none">▶</span> Run
                    </button>

                    <button
                        onClick={handleDebug}
                        className="flex items-center gap-2 px-3 py-1.5 bg-[#1f6feb] hover:bg-[#388bfd] text-white rounded text-sm font-medium transition-colors whitespace-nowrap"
                    >
                        <span>🐞</span> Debug
                    </button>

                    <div className="w-[1px] h-6 bg-[#2d333b] mx-2 shrink-0" />

                    <div className="text-sm text-[#8b949e] truncate" title={file.name}>
                        {file.name}
                    </div>
                </div>

                {/* Right Timer (Fixed) */}
                <Timer isRunning={isRunning} />
            </div>

            {/* Editor Area */}
            <div className="flex-1 overflow-hidden relative">
                <Editor
                    height="100%"
                    language={getLanguage(file.name)}
                    value={file.content}
                    onChange={handleEditorChange}
                    onMount={handleEditorDidMount}
                    theme="vs-dark"
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineHeight: 24,
                        padding: { top: 16 },
                        scrollBeyondLastLine: false,
                        fontFamily: "'JetBrains Mono', 'Fira Code', 'Menlo', 'Monaco', 'Courier New', monospace",
                        smoothScrolling: true,
                        cursorBlinking: "smooth",
                        cursorSmoothCaretAnimation: "on"
                    }}
                />
            </div>
        </div>
    )
}

export default MonacoEditor
