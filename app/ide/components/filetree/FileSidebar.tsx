'use client'

import React from 'react'
import FileTree from './FileTree'
import type { FileSystemItem } from '../../types/fileTypes'

interface FileSidebarProps {
    files?: FileSystemItem[]
    activeId?: string
    onSelect?: (item: FileSystemItem) => void
    onAddFile?: (parentId?: string) => void
    onAddFolder?: (parentId?: string) => void
    onDeleteFile?: (itemId: string) => void
    onRenameFile?: (itemId: string, newName: string) => void
}

const FileSidebar = ({
    files = [],
    activeId,
    onSelect,
    onAddFile,
    onAddFolder,
    onDeleteFile,
    onRenameFile
}: FileSidebarProps) => { // Removed SidebarToggle, assumed to be part of the outer layout or removed for simplicity
    return (
        <div className="h-full flex flex-col bg-bg-raised border-r border-border-light">
            <FileTree
                files={files}
                activeId={activeId}
                onSelect={onSelect}
                onAddFile={onAddFile}
                onAddFolder={onAddFolder}
                onDeleteFile={onDeleteFile}
                onRenameFile={onRenameFile}
            />
        </div>
    )
}

export default FileSidebar
