'use client'

import React, { useState, useEffect, useRef } from 'react'
import type { FileSystemItem } from '../../types/fileTypes'

interface FileNodeProps {
    item: FileSystemItem
    activeId?: string
    depth?: number
    onSelect?: (item: FileSystemItem) => void
    onAddFile?: (parentId: string) => void
    onAddFolder?: (parentId: string) => void
    onDelete?: (itemId: string) => void
    onRename?: (itemId: string, newName: string) => void
}

const FileNode = ({
    item,
    activeId,
    depth = 0,
    onSelect,
    onAddFile,
    onAddFolder,
    onDelete,
    onRename
}: FileNodeProps) => {
    const [isEditing, setIsEditing] = useState(false)
    const [editName, setEditName] = useState(item.name)
    const inputRef = useRef<HTMLInputElement>(null)

    const isActive = activeId === item.id
    const isFolder = item.type === 'folder'

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus()
            inputRef.current.select()
        }
    }, [isEditing])

    const handleDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        // Renaming allowed for both files and folders
        if (onRename) {
            setIsEditing(true)
        }
    }

    const handleSubmit = () => {
        if (editName.trim() && editName !== item.name) {
            onRename?.(item.id, editName)
        } else {
            setEditName(item.name)
        }
        setIsEditing(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit()
        } else if (e.key === 'Escape') {
            setEditName(item.name)
            setIsEditing(false)
        }
    }

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!isEditing) {
            onSelect?.(item)
        }
    }

    return (
        <div>
            <div
                onClick={handleClick}
                className={`
          flex items-center w-full py-1 pr-2 cursor-pointer transition-colors group
          ${isActive ? 'bg-[#3b82f633] text-[#e6edf3]' : 'text-[#8b949e] hover:bg-[#1f2428]'}
        `}
                style={{ paddingLeft: 12 + (depth * 16) }}
            >
                <span className="mr-1.5 flex items-center justify-center w-4 text-base">
                    {isFolder ? (item.isOpen ? '📂' : '📁') : '📄'}
                </span>

                {isEditing ? (
                    <input
                        ref={inputRef}
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onBlur={handleSubmit}
                        onKeyDown={handleKeyDown}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-[#161b22] text-[#e6edf3] border border-[#3b82f6] outline-none px-1 py-0.5 w-full text-inherit font-inherit"
                    />
                ) : (
                    <span
                        onDoubleClick={handleDoubleClick}
                        title={item.name}
                        className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis select-none"
                    >
                        {item.name}
                    </span>
                )}

                {/* Action Buttons (Visible on Hover or Active) */}
                {!isEditing && (
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">

                        {/* Folder Actions */}
                        {isFolder && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onAddFolder?.(item.id)
                                    }}
                                    className="ml-1 border-none bg-transparent text-[#8b949e] cursor-pointer p-0 text-xs opacity-60 hover:opacity-100 hover:text-[#e6edf3]"
                                    title="새 폴더"
                                >
                                    📁+
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onAddFile?.(item.id)
                                    }}
                                    className="ml-1 border-none bg-transparent text-[#8b949e] cursor-pointer p-0 text-xs opacity-60 hover:opacity-100 hover:text-[#e6edf3] leading-none"
                                    title="새 파일"
                                >
                                    📄+
                                </button>
                            </>
                        )}

                        {/* Delete Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                if (confirm('정말 삭제하시겠습니까?')) {
                                    onDelete?.(item.id)
                                }
                            }}
                            className="ml-4 border-none bg-transparent text-[#8b949e] cursor-pointer p-0 text-sm opacity-60 hover:opacity-100 hover:text-[#f78166]"
                            title="삭제"
                        >
                            ✕
                        </button>
                    </div>
                )}
            </div>

            {/* Render Children if Folder is Open */}
            {isFolder && item.isOpen && item.children && (
                <div>
                    {item.children.map(child => (
                        <FileNode
                            key={child.id}
                            item={child}
                            activeId={activeId}
                            depth={depth + 1}
                            onSelect={onSelect}
                            onAddFile={onAddFile}
                            onAddFolder={onAddFolder}
                            onDelete={onDelete}
                            onRename={onRename}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default FileNode
