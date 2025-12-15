'use client'

import React, { useState, useEffect } from 'react'

interface SplitLayoutProps {
    sidebar?: React.ReactNode
    editorTabs?: React.ReactNode
    editor?: React.ReactNode
    terminal?: React.ReactNode
}

const SplitLayout = ({ sidebar, editorTabs, editor, terminal }: SplitLayoutProps) => {
    const [terminalHeight, setTerminalHeight] = useState(180)
    const [isDragging, setIsDragging] = useState(false)

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true)
        e.preventDefault()
    }

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return

            // 창 하단에서부터의 거리 계산
            const newHeight = window.innerHeight - e.clientY

            // 최소 100px, 최대 80% 제한
            const clampedHeight = Math.max(100, Math.min(newHeight, window.innerHeight * 0.8))
            setTerminalHeight(clampedHeight)
        }

        const handleMouseUp = () => {
            setIsDragging(false)
        }

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [isDragging])

    return (
        <div
            className="flex h-screen bg-[#0d1117] overflow-hidden"
            style={{ cursor: isDragging ? 'ns-resize' : 'auto' }}
        >
            {/* Sidebar Area */}
            {sidebar && (
                <div className="flex w-[300px] border-r border-[#2b2b2b] flex-shrink-0">
                    {sidebar}
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#0f1520]">

                {/* TopBar (Placeholder) */}
                <div className="h-12 flex items-center px-4 border-b border-[#2d333b] bg-[#111827] text-[#e6edf3] font-semibold flex-shrink-0">
                    TopBar
                </div>

                {/* Editor + Terminal Container */}
                <div className="flex-1 flex flex-col overflow-hidden min-h-0">

                    {/* Editor Region */}
                    <div className="flex-1 flex flex-col overflow-hidden min-h-0">
                        {editorTabs}
                        {editor}
                    </div>

                    {/* Resize Handle */}
                    <div
                        className="h-1 cursor-ns-resize hover:bg-[#007fd4] transition-colors flex-shrink-0 z-10"
                        onMouseDown={handleMouseDown}
                    />

                    {/* Terminal Region */}
                    <div
                        className="border-t border-[#2d333b] flex-shrink-0"
                        style={{ height: terminalHeight }}
                    >
                        {terminal}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default SplitLayout
