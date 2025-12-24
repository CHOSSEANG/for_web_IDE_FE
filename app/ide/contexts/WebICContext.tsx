'use client'

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react'
import type { FileSystemItem } from '../types/fileTypes'
import { initialFiles } from '@/app/ide/lib/workspaceFiles'

// Helper Functions
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

const findParent = (items: FileSystemItem[], childId: string): FileSystemItem | undefined => {
    for (const item of items) {
        if (item.children?.some(child => child.id === childId)) return item
        if (item.children) {
            const found = findParent(item.children, childId)
            if (found) return found
        }
    }
    return undefined
}

interface WebICContextType {
    files: FileSystemItem[]
    activeId: string | undefined
    activeFile: { name: string; content: string } | null
    setActiveId: (id: string | undefined) => void
    addFile: (parentId?: string) => void
    addFolder: (parentId?: string) => void
    deleteItem: (itemId: string) => void
    renameItem: (itemId: string, newName: string) => void
    updateFileContent: (content: string) => void
}

const WebICContext = createContext<WebICContextType | undefined>(undefined)

export const WebICContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [files, setFiles] = useState<FileSystemItem[]>(initialFiles)
    const [activeId, setActiveId] = useState<string | undefined>('root-welcome')

    // Active File Derived State
    const activeFile = useMemo(() => {
        if (!activeId) return null
        const item = findItem(files, activeId)
        if (item && item.type === 'file') {
            return { name: item.name, content: item.content || '' }
        }
        return null
    }, [files, activeId])

    const getSiblings = (items: FileSystemItem[], targetId?: string, parentId?: string): FileSystemItem[] => {
        if (parentId) {
            const parent = findItem(items, parentId)
            return parent?.children || []
        }
        // If checking specific target's siblings (for rename)
        if (targetId) {
            const parent = findParent(items, targetId)
            return parent ? parent.children! : items
        }
        return items
    }

    // --- Actions ---

    const addFile = useCallback((parentId?: string) => {
        const name = prompt('파일 이름을 입력하세요')
        if (!name) return

        setFiles(prev => {
            // 1. Check duplicate
            const siblings = getSiblings(prev, undefined, parentId)
            if (siblings.some(f => f.name === name)) {
                alert('이미 존재하는 파일 이름입니다.')
                return prev
            }

            const newFile: FileSystemItem = {
                id: `file-${Date.now()}`,
                name,
                type: 'file',
                content: ''
            }

            if (!parentId) return [...prev, newFile]

            // Update Tree
            const updateTree = (items: FileSystemItem[]): FileSystemItem[] => {
                return items.map(item => {
                    if (item.id === parentId) {
                        return { ...item, children: [...(item.children || []), newFile], isOpen: true }
                    }
                    if (item.children) {
                        return { ...item, children: updateTree(item.children) }
                    }
                    return item
                })
            }
            return updateTree(prev)
        })
    }, [])

    const addFolder = useCallback((parentId?: string) => {
        const name = prompt('폴더 이름을 입력하세요')
        if (!name) return

        setFiles(prev => {
            // Check duplicate
            const siblings = getSiblings(prev, undefined, parentId)
            if (siblings.some(f => f.name === name)) {
                alert('이미 존재하는 폴더 이름입니다.')
                return prev
            }

            const newFolder: FileSystemItem = {
                id: `folder-${Date.now()}`,
                name,
                type: 'folder',
                children: [],
                isOpen: true
            }

            if (!parentId) return [...prev, newFolder]

            const updateTree = (items: FileSystemItem[]): FileSystemItem[] => {
                return items.map(item => {
                    if (item.id === parentId) {
                        return { ...item, children: [...(item.children || []), newFolder], isOpen: true }
                    }
                    if (item.children) {
                        return { ...item, children: updateTree(item.children) }
                    }
                    return item
                })
            }
            return updateTree(prev)
        })
    }, [])

    const deleteItem = useCallback((itemId: string) => {
        setFiles(prev => {
            const deleteRecursive = (items: FileSystemItem[]): FileSystemItem[] => {
                return items
                    .filter(item => item.id !== itemId)
                    .map(item => {
                        if (item.children) {
                            return { ...item, children: deleteRecursive(item.children) }
                        }
                        return item
                    })
            }
            return deleteRecursive(prev)
        })
        if (activeId === itemId) setActiveId(undefined)
    }, [activeId])

    const renameItem = useCallback((itemId: string, newName: string) => {
        setFiles(prev => {
            // Check duplicate in the same level
            const siblings = getSiblings(prev, itemId)
            if (siblings.some(f => f.id !== itemId && f.name === newName)) {
                alert('이미 존재하는 이름입니다.')
                return prev
            }

            const updateRecursive = (items: FileSystemItem[]): FileSystemItem[] => {
                return items.map(item => {
                    if (item.id === itemId) {
                        return { ...item, name: newName }
                    }
                    if (item.children) {
                        return { ...item, children: updateRecursive(item.children) }
                    }
                    return item
                })
            }
            return updateRecursive(prev)
        })
    }, [])

    const updateFileContent = useCallback((content: string) => {
        if (!activeId) return
        setFiles(prev => {
            const updateRecursive = (items: FileSystemItem[]): FileSystemItem[] => {
                return items.map(item => {
                    if (item.id === activeId) {
                        return { ...item, content }
                    }
                    if (item.children) {
                        return { ...item, children: updateRecursive(item.children) }
                    }
                    return item
                })
            }
            return updateRecursive(prev)
        })
    }, [activeId])

    return (
        <WebICContext.Provider value={{
            files,
            activeId,
            activeFile,
            setActiveId,
            addFile,
            addFolder,
            deleteItem,
            renameItem,
            updateFileContent
        }}>
            {children}
        </WebICContext.Provider>
    )
}

export const useWebIC = () => {
    const context = useContext(WebICContext)
    if (context === undefined) {
        throw new Error('useWebIC must be used within a WebICContextProvider')
    }
    return context
}
