'use client'

import { Editor } from '@monaco-editor/react'
import { useState, useRef } from 'react'
import type { editor as MonacoEditorInstance } from 'monaco-editor'
import Timer from './Timer'
import { useWebIC } from '@/app/ide/contexts/WebICContext'
import { useTheme } from '@/app/providers/theme-provider'

interface MonacoEditorProps {
    file: {
        name: string
        content: string
        language?: string
    }
    onChange?: (value: string) => void
    onRun?: (code: string) => void
    onDebug?: (code: string) => void
    onSave?: (code: string) => void
}

const MonacoEditor = ({ file, onChange, onRun, onDebug, onSave }: MonacoEditorProps) => {
    const [isRunning, setIsRunning] = useState(false)
    const { setIsWorking } = useWebIC()
    const { theme } = useTheme()
    const editorRef = useRef<MonacoEditorInstance.IStandaloneCodeEditor | null>(null)
    const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    const handleEditorDidMount = (editorInstance: MonacoEditorInstance.IStandaloneCodeEditor) => {
        editorRef.current = editorInstance;

        // 에디터의 실제 HTML 요소를 가져옵니다.
        const domNode = editorInstance.getDomNode();
        if (domNode) {
            // 모나코 에디터가 입력을 처리하기 위해 사용하는 textarea를 찾습니다.
            const textarea = domNode.querySelector('textarea');
            if (textarea) {
                // 브라우저의 자동 대문자 변환 기능을 명시적으로 끕니다.
                textarea.setAttribute('autocapitalize', 'off');
                textarea.setAttribute('autocorrect', 'off');
                textarea.setAttribute('spellcheck', 'false');
                // 추가로 자동완성도 꺼주면 좋습니다.
                textarea.setAttribute('autocomplete', 'off');
            }
        }
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
        setIsWorking(true)

        // Reset the idle timeout
        if (idleTimeoutRef.current) {
            clearTimeout(idleTimeoutRef.current)
        }

        // Set back to "Idle" after 2 seconds of inactivity
        idleTimeoutRef.current = setTimeout(() => {
            setIsRunning(false)
            setIsWorking(false)
        }, 2000)
    }

    const handleRun = () => {
        // UI 상태 변경을 먼저 수행 (조건문 밖으로)
        setIsRunning(true)
        setIsWorking(true)

        // Reset idle timeout
        if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current)
        idleTimeoutRef.current = setTimeout(() => {
            setIsRunning(false)
            setIsWorking(false)
        }, 2000)

        // 실제 실행 로직
        if (onRun) {
            const code = editorRef.current ? editorRef.current.getValue() : file.content
            onRun(code)
        }
    }

    const handleDebug = () => {
        // UI 상태 변경을 먼저 수행
        setIsRunning(true)
        setIsWorking(true)

        // Reset idle timeout
        if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current)
        idleTimeoutRef.current = setTimeout(() => {
            setIsRunning(false)
            setIsWorking(false)
        }, 2000)

        // 실제 디버그 로직
        if (onDebug) {
            const code = editorRef.current ? editorRef.current.getValue() : file.content
            onDebug(code)
        }
    }

    const handleSave = () => {
        if (onSave) {
            const code = editorRef.current ? editorRef.current.getValue() : file.content
            onSave(code)
        }
    }

    return (
        <div className="h-full flex flex-col bg-bg-base text-text-primary">
            {/* Toolbar */}
            <div className={`
                flex justify-between items-center px-4 py-2 gap-4 
                border-b border-border-light bg-bg-subtle overflow-hidden
                font-mono font-bold transition-colors duration-300
                ${isRunning ? 'text-success' : 'text-text-muted'}
            `}>
                {/* Left Controls */}
                <div className="flex items-center gap-2 min-w-0 shrink overflow-hidden">
                    <button
                        onClick={handleRun}
                        className="flex items-center gap-2 px-3 py-1.5 bg-success hover:opacity-90 text-white rounded text-sm font-medium transition-colors whitespace-nowrap font-sans"
                    >
                        <span className="text-lg leading-none">▶</span> Run
                    </button>

                    <button
                        onClick={handleDebug}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm font-medium transition-colors whitespace-nowrap"
                    >
                        <span>🐞</span> Debug
                    </button>

                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded text-sm font-medium transition-colors whitespace-nowrap"
                    >
                        <span>💾</span> Save
                    </button>

                    <div className="w-[1px] h-6 bg-border-light mx-2 shrink-0" />

                    <div className="text-sm text-text-secondary truncate" title={file.name}>
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
                    theme={theme === "dark" ? "vs-dark" : "vs"}
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
