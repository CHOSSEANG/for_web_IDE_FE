'use client'

import { useState, useRef, useEffect } from 'react'

const TABS = ['PROBLEMS', 'OUTPUT', 'DEBUG CONSOLE', 'TERMINAL']

interface TerminalPanelProps {
    onCommand?: (command: string) => Promise<string> | string
    initialLogs?: string[]
    prompt?: string
    activeTab?: string
    onTabChange?: (tab: string) => void
    outputLogs?: string[]
    debugLogs?: string[]
}

const TerminalPanel = ({
    onCommand,
    initialLogs = ['$ 터미널이 준비되었습니다.', ' help 명령어를 입력하세요!'],
    prompt = '$',
    activeTab: controlledActiveTab,
    onTabChange,
    outputLogs = [],
    debugLogs = []
}: TerminalPanelProps) => {
    const [localActiveTab, setLocalActiveTab] = useState('TERMINAL')
    const activeTab = controlledActiveTab || localActiveTab

    const handleTabChange = (tab: string) => {
        if (onTabChange) {
            onTabChange(tab)
        } else {
            setLocalActiveTab(tab)
        }
    }

    const [logs, setLogs] = useState<string[]>(initialLogs)
    const [input, setInput] = useState('')
    const [isExecuting, setIsExecuting] = useState(false)
    const logsEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [logs])

    useEffect(() => {
        inputRef.current?.focus()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const command = input.trim()
        if (!command) return

        setLogs((prev) => [...prev, `${prompt} ${command}`])
        setInput('')
        setIsExecuting(true)

        try {
            if (onCommand) {
                const result = await onCommand(command)
                setLogs((prev) => [...prev, result])
            } else {
                const result = handleDefaultCommand(command)
                setLogs((prev) => [...prev, result])
            }
        } catch (error) {
            setLogs((prev) => [...prev, `오류: ${error instanceof Error ? error.message : String(error)}`])
        } finally {
            setIsExecuting(false)
            inputRef.current?.focus()
        }
    }

    const handleDefaultCommand = (command: string): string => {
        const cmd = command.toLowerCase().trim()
        if (cmd === 'clear' || cmd === 'cls') {
            setLogs([`${prompt} 터미널이 초기화되었습니다.`])
            return ''
        }
        if (cmd === 'help') {
            return `사용 가능한 명령어:
  help     - 도움말 표시
  clear    - 터미널 초기화
  echo     - 텍스트 출력
  date     - 현재 날짜/시간
  version  - 버전 정보`
        }
        if (cmd.startsWith('echo ')) return command.substring(5)
        if (cmd === 'date') return new Date().toLocaleString('ko-KR')
        if (cmd === 'version') return 'Terminal Panel v1.0.0'
        return `명령어를 찾을 수 없습니다: ${command}`
    }

    return (
        <div className="flex flex-col h-full bg-[#0b101a] text-[#e6edf3] font-mono text-[13px]">
            {/* Tabs Header */}
            <div className="flex border-b border-[#2d333b] bg-[#0b101a]">
                {TABS.map((tab) => (
                    <div
                        key={tab}
                        className={`px-4 py-2 cursor-pointer transition-colors border-b hover:text-[#c9d1d9] 
              ${activeTab === tab
                                ? 'text-[#e6edf3] border-[#f78166]'
                                : 'text-[#8b949e] border-transparent'
                            }`}
                        onClick={() => handleTabChange(tab)}
                    >
                        {tab}
                    </div>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden min-h-0">

                {/* 1. 터미널 탭 */}
                {activeTab === 'TERMINAL' && (
                    <>
                        <div className="flex-1 flex flex-col gap-1 p-3 overflow-y-auto">
                            {logs.map((log, idx) => (
                                <span key={idx} className="whitespace-pre-wrap break-all">{log}</span>
                            ))}
                            {isExecuting && <span className="text-[#8b949e]">실행 중...</span>}
                            <div ref={logsEndRef} />
                        </div>

                        <form onSubmit={handleSubmit} className="flex border-t border-[#2d333b] bg-[#0b101a]">
                            <span className="py-2.5 pl-3 pr-2 text-[#8b949e] select-none">{prompt}</span>
                            <input
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="명령어를 입력하세요..."
                                disabled={isExecuting}
                                className="flex-1 bg-transparent border-none outline-none text-[#e6edf3] py-2.5 placeholder:text-[#484f58] disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </form>
                    </>
                )}

                {/* 2. PROBLEMS TAB */}
                {activeTab === 'PROBLEMS' && (
                    <div className="p-5 text-[#8b949e]">No problems detected in workspace.</div>
                )}

                {/* 3. OUTPUT TAB */}
                {activeTab === 'OUTPUT' && (
                    <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-1 whitespace-pre-wrap">
                        {outputLogs.length > 0 ? (
                            outputLogs.map((log, idx) => <span key={idx} className="break-all">{log}</span>)
                        ) : (
                            <div className="text-[#8b949e]">프로그램 실행 대기 중...</div>
                        )}
                    </div>
                )}

                {/* 4. DEBUG CONSOLE TAB */}
                {activeTab === 'DEBUG CONSOLE' && (
                    <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-1 whitespace-pre-wrap">
                        {debugLogs.length > 0 ? (
                            debugLogs.map((log, idx) => <span key={idx} className="break-all">{log}</span>)
                        ) : (
                            <div className="text-[#8b949e]">디버그 세션이 활성화되지 않았습니다.</div>
                        )}
                    </div>
                )}

            </div>
        </div>
    )
}

export default TerminalPanel
