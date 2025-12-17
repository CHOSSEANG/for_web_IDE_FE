'use client'

import React, { useRef, useState, useEffect } from 'react'

interface SplitLayoutProps {
    sidebar: React.ReactNode
    editorTabs: React.ReactNode
    editor: React.ReactNode
    terminal: React.ReactNode
}

const SplitLayout = ({ sidebar, editorTabs, editor, terminal }: SplitLayoutProps) => {
    const [sidebarWidth, setSidebarWidth] = useState(240)
    const [terminalHeight, setTerminalHeight] = useState(240)

    const [isResizingSidebar, setIsResizingSidebar] = useState(false)
    const [isResizingTerminal, setIsResizingTerminal] = useState(false)

    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizingSidebar && !isResizingTerminal) return

            if (isResizingSidebar && containerRef.current) {
                e.preventDefault()
                const newWidth = e.clientX - containerRef.current.getBoundingClientRect().left
                setSidebarWidth(Math.max(150, Math.min(newWidth, 600)))
            }

            if (isResizingTerminal && containerRef.current) {
                e.preventDefault()
                // Calculate height from bottom
                const containerRect = containerRef.current.getBoundingClientRect()
                const newHeight = containerRect.bottom - e.clientY
                setTerminalHeight(Math.max(100, Math.min(newHeight, containerRect.height - 100)))
            }
        }

        const handleMouseUp = () => {
            setIsResizingSidebar(false)
            setIsResizingTerminal(false)
            document.body.style.cursor = 'default'
        }

        if (isResizingSidebar || isResizingTerminal) {
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [isResizingSidebar, isResizingTerminal])

    return (
        <div
            ref={containerRef}
            className="flex h-screen w-full overflow-hidden bg-[#0d1117] text-[#e6edf3]"
        >
            {/* Sidebar */}
            <div
                style={{ width: sidebarWidth }}
                className="flex-shrink-0 flex flex-col border-r border-[#2d333b]"
            >
                {sidebar}
            </div>

            {/* Sidebar Resizer */}
            <div
                className="w-1 cursor-col-resize hover:bg-[#3b82f6] transition-colors"
                onMouseDown={() => {
                    setIsResizingSidebar(true)
                    document.body.style.cursor = 'col-resize'
                }}
            />

            {/* Main Content (Editor + Terminal) */}
            <div className="flex flex-1 flex-col min-w-0">

                {/* Editor Area */}
                <div className="flex flex-col flex-1 min-h-0">
                    <div className="flex-shrink-0 border-b border-[#2d333b]">
                        {editorTabs}
                    </div>
                    <div className="flex-1 relative">
                        {editor}
                    </div>
                </div>

                {/* Terminal Resizer */}
                <div
                    className="h-1 cursor-row-resize hover:bg-[#3b82f6] transition-colors border-t border-[#2d333b]"
                    onMouseDown={() => {
                        setIsResizingTerminal(true)
                        document.body.style.cursor = 'row-resize'
                    }}
                />

                {/* Terminal Area */}
                <div
                    style={{ height: terminalHeight }}
                    className="flex-shrink-0 flex flex-col"
                >
                    {terminal}
                </div>
            </div>
        </div>
    )
}

export default SplitLayout
