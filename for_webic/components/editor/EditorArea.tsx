'use client'

import { useState, useCallback } from 'react'
import SplitLayout from '../ui/SplitLayout'
import MonacoEditor from './MonacoEditor'
import TerminalPanel from '../terminal/TerminalPanel'

// 예시 파일 데이터 (나중에 부모 컴포넌트에서 props로 받아오도록 수정 가능)
const initialFile = {
    id: '1',
    name: 'script.js',
    content: `// JavaScript 코드를 입력하고 Run 버튼을 누르세요.
console.log('Hello, World!');

for (let i = 0; i < 3; i++) {
  console.log('Count:', i);
}`
}

const EditorArea = () => {
    const [file, setFile] = useState(initialFile)

    // 터미널 상태
    const [activeTab, setActiveTab] = useState('TERMINAL')
    const [logs, setLogs] = useState<string[]>([])           // 일반 터미널 로그
    const [outputLogs, setOutputLogs] = useState<string[]>([]) // Run 실행 결과
    const [debugLogs, setDebugLogs] = useState<string[]>([])   // Debug 실행 결과

    // 에디터 내용 변경 핸들러
    const handleContentChange = (value: string) => {
        setFile(prev => ({ ...prev, content: value }))
    }

    // === 코드 실행 로직 (브라우저 내 실행) ===
    const executeCode = useCallback((code: string) => {
        const capturedLogs: string[] = []

        // console 객체 모킹 (로그 캡처용)
        const mockConsole = {
            log: (...args: any[]) => {
                capturedLogs.push(args.map(a =>
                    typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)
                ).join(' '))
            },
            error: (...args: any[]) => capturedLogs.push(`[ERROR] ${args.join(' ')}`),
            warn: (...args: any[]) => capturedLogs.push(`[WARN] ${args.join(' ')}`),
            info: (...args: any[]) => capturedLogs.push(`[INFO] ${args.join(' ')}`),
        }

        try {
            capturedLogs.push('> Executing...')
            // new Function으로 코드 실행 (console 객체 주입)
            const run = new Function('console', code)
            run(mockConsole)
            capturedLogs.push('> Exited with code 0')
        } catch (err) {
            capturedLogs.push(`> Runtime Error: ${err instanceof Error ? err.message : String(err)}`)
        }

        return capturedLogs
    }, [])

    // Run 버튼 핸들러
    const handleRun = async (content: string, language: string) => {
        setActiveTab('OUTPUT') // 결과 탭으로 이동
        if (language === 'javascript' || language === 'typescript') {
            const result = executeCode(content)
            setOutputLogs(result)
        } else {
            setOutputLogs(['> 언어가 지원되지 않습니다 (JS/TS만 가능)'])
        }
    }

    // Debug 버튼 핸들러 (예시)
    const handleDebug = async (content: string, language: string) => {
        setActiveTab('DEBUG CONSOLE')
        if (language === 'javascript' || language === 'typescript') {
            const result = executeCode(content)
            setDebugLogs(['[Diff Debugging Start]', ...result, '[Debugging End]'])
        } else {
            setDebugLogs(['> 디버깅을 지원하지 않는 언어입니다.'])
        }
    }

    return (
        <div className="h-full w-full">
            <SplitLayout
                // 사이드바나 탭이 필요하면 여기에 추가 (현재는 에디터/터미널 위주)
                editor={
                    <MonacoEditor
                        file={file}
                        onChange={handleContentChange}
                        onRun={handleRun}
                        onDebug={handleDebug}
                    />
                }
                terminal={
                    <TerminalPanel
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        outputLogs={outputLogs}
                        debugLogs={debugLogs}
                    />
                }
            />
        </div>
    )
}

export default EditorArea
