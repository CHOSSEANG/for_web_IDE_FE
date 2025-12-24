'use client'

import { useState, useEffect } from 'react'

interface TimerProps {
    isRunning: boolean // 타이머 작동 여부
}

const Timer = ({ isRunning }: TimerProps) => {
    // 경과 시간(초 단위)
    const [timer, setTimer] = useState(0)

    // isRunning 상태에 따라 타이머 시작/정지
    useEffect(() => {
        let interval: NodeJS.Timeout
        if (isRunning) {
            // 1초마다 타이머 증가
            interval = setInterval(() => {
                setTimer((prev) => prev + 1)
            }, 1000)
        }
        // 컴포넌트 언마운트 시 인터벌 정리
        return () => clearInterval(interval)
    }, [isRunning])

    // 초를 HH:MM:SS 형식으로 변환
    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600)
        const mins = Math.floor((seconds % 3600) / 60)
        const secs = seconds % 60
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
                {formatTime(timer)}
            </div>
        </div>
    )
}

export default Timer
