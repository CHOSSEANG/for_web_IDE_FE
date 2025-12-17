'use client'

import { useState, useMemo } from 'react'
import SplitLayout from '../ui/SplitLayout'
import FileSidebar from '../files/FileSidebar'
import MonacoEditor from './MonacoEditor'
import TerminalPanel from '../terminal/TerminalPanel'
import { initialFiles } from '../../styles/theme'
import type { FileSystemItem } from '../../types/fileTypes'

// Helper functions (same as EditorPage.tsx but could be moved to utils)
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

const WebICEditor = () => {
    const [files, setFiles] = useState<FileSystemItem[]>(initialFiles)
    const [activeId, setActiveId] = useState<string | undefined>('root-welcome')
    const [activeTerminalTab, setActiveTerminalTab] = useState('TERMINAL')
    const [runOutput, setRunOutput] = useState<string[]>([])
    const [debugOutput, setDebugOutput] = useState<string[]>([])

    const activeItem = useMemo(() => activeId ? findItem(files, activeId) : undefined, [files, activeId])
    const allFiles = useMemo(() => getAllFiles(files), [files])

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

    const executeCode = (code: string) => {
        const logs: string[] = []
        // Use built-in Console parameter types so we stop introducing explicit anys.
        const mockConsole = {
            log: (...args: Parameters<Console["log"]>) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
            warn: (...args: Parameters<Console["warn"]>) => logs.push(`[WARN] ${args.join(' ')}`),
            error: (...args: Parameters<Console["error"]>) => logs.push(`[ERROR] ${args.join(' ')}`),
            info: (...args: Parameters<Console["info"]>) => logs.push(`[INFO] ${args.join(' ')}`),
        }
        try {
            const run = new Function('console', code)
            run(mockConsole)
        } catch (e) {
            logs.push(`Error: ${e}`)
        }
        return logs
    }

    const handleRun = (content: string) => {
        setActiveTerminalTab('OUTPUT')
        const logs = executeCode(content)
        setRunOutput(logs)
    }

    const handleDebug = (content: string) => {
        setActiveTerminalTab('DEBUG CONSOLE')
        const logs = executeCode(content)
        setDebugOutput(['> Debug Started', ...logs, '> Debug Ended'])
    }

    const activeFileForEditor = activeItem && activeItem.type === 'file' ? {
        name: activeItem.name,
        content: activeItem.content || ''
    } : { name: '', content: '' }

    // Simple Tabs (can be enhanced)
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
        <SplitLayout
            sidebar={
                <FileSidebar
                    files={files}
                    activeId={activeId}
                    onSelect={handleSelect}
                    onAddFile={handleAddFile}
                    onAddFolder={handleAddFolder}
                    onDeleteFile={handleDeleteFile}
                    onRenameFile={handleRenameFile}
                />
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
    )
}

export default WebICEditor
