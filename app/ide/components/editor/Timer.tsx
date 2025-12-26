'use client'

import { useWebIC } from '@/app/ide/contexts/WebICContext'

interface TimerProps {
    isRunning: boolean // 타이머 작동 여부
}

const Timer = ({ isRunning }: TimerProps) => {
    // WebICContext에서 현재 세션 시간(ms)을 가져옴
    const { currentSessionMs } = useWebIC()

    // 밀리초를 HH:MM:SS 형식으로 변환
    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000)
        const hours = Math.floor(totalSeconds / 3600)
        const mins = Math.floor((totalSeconds % 3600) / 60)
        const secs = totalSeconds % 60
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <div className="flex items-center gap-3 ml-auto shrink-0 pl-2">
            {/* 상태 표시: 작동 중이면 "● 나 일하는 중", 아니면 "○ 나 쉼" */}
            <div className={`text-sm font-medium transition-colors ${isRunning ? 'text-[#4caf50]' : 'text-[#8b949e]'}`}>
                {isRunning ? '● 나 일하는 중' : '○ 나 쉼'}
            </div>
            {/* 타이머 텍스트: 작동 중이면 초록색, 아니면 회색 */}
            <div className={`font-mono text-lg font-bold transition-colors ${isRunning ? 'text-[#4caf50]' : 'text-[#8b949e]'}`}>
                {formatTime(currentSessionMs)}
            </div>
        </div>
    )
}

export default Timer
