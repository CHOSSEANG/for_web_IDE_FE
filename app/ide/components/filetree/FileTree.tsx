'use client'

import React from 'react'
import FileNode from './FileNode'
import type { FileSystemItem } from '../../types/fileTypes'

interface FileTreeProps {
    files: FileSystemItem[]
    activeId?: string
    onSelect?: (item: FileSystemItem) => void
    onAddFile?: (parentId?: string) => void
    onAddFolder?: (parentId?: string) => void
    onDeleteFile?: (fileId: string) => void
    onRenameFile?: (fileId: string, newName: string) => void
}

const FileTree = ({
    files,
    activeId,
    onSelect,
    onAddFile,
    onAddFolder,
    onDeleteFile,
    onRenameFile
}: FileTreeProps) => {
    return (
        <div className="flex-1 flex flex-col min-w-0 bg-bg-base text-text-primary">
            <div className="px-[14px] py-[12px] border-b border-border-light font-semibold text-text-muted flex items-center justify-between gap-2">
                <span>EXPLORER</span>
                <div className="flex gap-1">
                    <button
                        onClick={() => onAddFolder?.()} // Root folder
                        className="border border-border-strong bg-bg-subtle text-text-primary rounded px-2 py-1 cursor-pointer text-xs hover:bg-bg-raised transition-colors"
                        title="새 폴더 생성"
                    >
                        + 폴더
                    </button>
                    <button
                        onClick={() => onAddFile?.()} // Root file
                        className="border border-border-strong bg-bg-subtle text-text-primary rounded px-2 py-1 cursor-pointer text-xs hover:bg-bg-raised transition-colors"
                        title="새 파일 생성"
                    >
                        + 파일
                    </button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto">
                {files.length === 0 && (
                    <div className="p-[14px] text-text-muted italic text-[0.9em]">
                        파일이 없습니다.
                    </div>
                )}
                {files.map((item) => (
                    <FileNode
                        key={item.id}
                        item={item}
                        activeId={activeId}
                        onSelect={onSelect}
                        onAddFile={onAddFile}
                        onAddFolder={onAddFolder}
                        onDelete={onDeleteFile}
                        onRename={onRenameFile}
                    />
                ))}
            </div>
        </div>
    )
}

export default FileTree
