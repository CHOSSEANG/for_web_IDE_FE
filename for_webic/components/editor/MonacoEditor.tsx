'use client' // Next.js의 App Router에서 클라이언트 사이드 로직(상태 관리, 브라우저 API 등)을 사용하기 위해 필수입니다.

import { useState, useEffect, useRef } from 'react'
import Editor, { type OnMount } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'

// 컴포넌트가 부모로부터 받아오는 데이터(Props)의 타입 정의
interface MonacoEditorProps {
    file?: {
        id: string
        name: string
        content: string
    }
    // 코드가 변경될 때 호출되는 콜백 함수
    onChange?: (value: string) => void
    // 실행(Run) 버튼 클릭 시 호출되는 함수 (비동기 처리 가능)
    onRun?: (content: string, language: string) => void | Promise<void>
    // 디버그(Debug) 버튼 클릭 시 호출되는 함수
    onDebug?: (content: string, language: string) => void | Promise<void>
}

// 시간(초)을 "00:00:00" 형식의 문자열로 변환하는 유틸리티 함수
const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    // 숫자가 1자리일 경우 앞에 '0'을 붙여 2자리로 만듦
    const pad = (num: number) => num.toString().padStart(2, '0')
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}

const MonacoEditor = ({ file, onChange, onRun, onDebug }: MonacoEditorProps) => {
    // === 상태 관리 (State Management) ===
    const [time, setTime] = useState(0)             // 작업 시간(초) 누적
    const [isActive, setIsActive] = useState(false) // 사용자가 에디터를 사용 중인지 여부 (작업 중/쉼)
    const [isRunning, setIsRunning] = useState(false)   // 코드 실행 중 여부 (로딩 상태 표시용)
    const [isDebugging, setIsDebugging] = useState(false) // 디버깅 중 여부

    // === 레퍼런스 (Refs) ===
    // 타이머 ID를 저장하여 필요할 때 취소할 수 있도록 함
    const inactivityTimer = useRef<number | null>(null)
    // 모나코 에디터 인스턴스에 직접 접근하기 위한 ref
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)

    // === 작업 타이머 로직 ===
    // isActive 상태가 true일 때만 1초마다 time을 증가시킴
    useEffect(() => {
        let interval: number

        if (isActive) {
            interval = window.setInterval(() => {
                setTime((prev) => prev + 1)
            }, 1000)
        }

        // 컴포넌트가 언마운트되거나 isActive가 바뀌면 인터벌 정리
        return () => clearInterval(interval)
    }, [isActive])

    // 파일 확장자를 기반으로 언어 설정 (예: app.tsx -> tsx)
    const language = file?.name?.split('.').pop() || 'plaintext'

    // === 에디터 내용 변경 핸들러 ===
    // 사용자가 키보드로 입력할 때마다 호출됨
    const handleEditorChange = (value: string | undefined) => {
        onChange?.(value ?? '')

        // 입력이 발생했으므로 '작업 중' 상태로 전환
        setIsActive(true)

        // 기존의 '쉼' 전환 타이머가 있다면 취소 (연속 입력 시 타이머 초기화)
        if (inactivityTimer.current) {
            clearTimeout(inactivityTimer.current)
        }

        // 2초 동안 입력이 없으면 '쉼' 상태로 자동 전환
        inactivityTimer.current = window.setTimeout(() => {
            setIsActive(false)
        }, 2000)
    }

    // === 실행(Run) 버튼 핸들러 ===
    const handleRun = async () => {
        // 파일이 없거나 이미 실행 중이면 무시
        if (!file || isRunning || isDebugging) return

        setIsRunning(true)
        try {
            if (onRun) {
                // 부모 컴포넌트에서 전달받은 실행 함수 호출
                await onRun(file.content, language)
            } else {
                console.log('Run:', file.content)
            }
        } catch (error) {
            console.error('Run error:', error)
        } finally {
            // 성공하든 실패하든 실행 상태 종료
            setIsRunning(false)
        }
    }

    // === 디버그(Debug) 버튼 핸들러 ===
    const handleDebug = async () => {
        if (!file || isRunning || isDebugging) return

        setIsDebugging(true)
        try {
            if (onDebug) {
                await onDebug(file.content, language)
            } else {
                console.log('Debug:', file.content)
            }
        } catch (error) {
            console.error('Debug error:', error)
        } finally {
            setIsDebugging(false)
        }
    }

    // === 단축키 설정 (F5) ===
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // F5 단독 누름 -> 디버그
            if (e.key === 'F5' && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
                e.preventDefault() // 브라우저 새로고침 방지
                handleDebug()
            }
            // Ctrl + F5 (또는 Cmd + F5) -> 실행
            if (e.key === 'F5' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault()
                handleRun()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [file, isRunning, isDebugging, language])

    // === 모나코 에디터 초기 설정 ===
    const handleEditorDidMount: OnMount = (editor, monacoInstance) => {
        editorRef.current = editor

        // TypeScript/JavaScript 관련 문법 검사(Diagnostics) 옵션 설정
        // 기본적으로 꺼져있는 경우가 있어 명시적으로 켭니다.
        if (['typescript', 'ts', 'tsx', 'javascript', 'js', 'jsx'].includes(language)) {
            const defaults = language.includes('ts')
                ? monacoInstance.languages.typescript.typescriptDefaults
                : monacoInstance.languages.typescript.javascriptDefaults

            defaults.setDiagnosticsOptions({
                noSemanticValidation: false, // 의미론적 검사 활성화
                noSyntaxValidation: false,   // 문법 검사 활성화
                noSuggestionDiagnostics: false,
                diagnosticCodesToIgnore: [],
            })
        }

        // 에디터의 자동 완성 및 추천 기능 활성화
        editor.updateOptions({
            quickSuggestions: true,
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: 'on',
            tabCompletion: 'on',
        })
    }

    // 파일이 선택되지 않았을 때 표시할 UI
    if (!file) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-[#0f1520] text-gray-500 font-mono text-sm">
                파일을 선택하세요.
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full w-full bg-[#0f1520]">
            {/* 
              상단 툴바 영역 
              - items-center: 수직 중앙 정렬
              - justify-between: 좌우 끝으로 요소 배치 (중간 공백 채움)
            */}
            <div className={`flex items-center justify-between border-b border-[#30363d] px-4 py-2 text-sm font-mono transition-colors duration-300 ${isActive ? 'text-green-500' : 'text-gray-500'}`}>

                {/* 
                  왼쪽: 실행 제어 버튼 그룹 
                  - shrink: 공간 부족 시 줄어듦
                  - min-w-0: 내용물보다 더 작아질 수 있음
                  - overflow-hidden: 잘리면 숨김
                */}
                <div className="flex items-center gap-2 shrink min-w-0 overflow-hidden">
                    <button
                        onClick={handleRun}
                        disabled={isRunning || isDebugging}
                        className="flex items-center gap-1 rounded bg-[#21262d] px-3 py-1.5 text-xs font-semibold text-gray-200 border border-[#30363d] hover:bg-[#1f6feb] hover:border-[#1f6feb] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                        title="코드 실행 (Ctrl+F5)"
                    >
                        ▶ Run
                    </button>
                    <button
                        onClick={handleDebug}
                        disabled={isRunning || isDebugging}
                        className="flex items-center gap-1 rounded bg-[#21262d] px-3 py-1.5 text-xs font-semibold text-gray-200 border border-[#30363d] hover:bg-[#8957e5] hover:border-[#8957e5] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                        title="디버그 시작 (F5)"
                    >
                        🐛 Debug
                    </button>
                </div>

                {/* 
                  오른쪽: 상태 표시 및 타이머 
                  - flex-shrink-0: 절대 줄어들지 않음 (중요!)
                  - whitespace-nowrap: 텍스트 줄바꿈 방지
                  - ml-auto: 왼쪽 여백을 최대로 사용하여 오른쪽 끝에 고정 (반응형 대응 핵심)
                */}
                <div className="flex items-center gap-4 flex-shrink-0 whitespace-nowrap ml-auto">
                    <span className="text-xs">{isActive ? '● Working' : '○ Idle'}</span>
                    <span className="text-lg font-bold">{formatTime(time)}</span>
                </div>
            </div>

            {/* 에디터 본문 영역 */}
            <div className="flex-1 min-h-0 relative">
                <Editor
                    value={file.content}
                    language={language}
                    theme="vs-dark" // 다크 테마 사용
                    options={{
                        minimap: { enabled: false },     // 우측 미니맵 숨김
                        fontSize: 14,
                        automaticLayout: true,           // 부모 크기 변경 시 자동 리사이징
                        scrollBeyondLastLine: false,     // 마지막 줄 이후로 과도한 스크롤 방지
                        quickSuggestions: true,
                        suggestOnTriggerCharacters: true,
                        acceptSuggestionOnEnter: 'on',
                        tabCompletion: 'on',
                        renderValidationDecorations: 'on', // 문법 에러 빨간줄 표시
                        wordBasedSuggestions: 'matchingDocuments',
                    }}
                    onChange={handleEditorChange}
                    onMount={handleEditorDidMount}
                    height="100%"
                />
            </div>
        </div>
    )
}

export default MonacoEditor
