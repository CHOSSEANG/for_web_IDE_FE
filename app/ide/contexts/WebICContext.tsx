'use client'

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import type { FileSystemItem } from '../types/fileTypes'
import { initialFiles } from '@/app/ide/lib/workspaceFiles'

// API Configuration
const API_BASE_URL = 'https://api.webicapp.com';

// --- Types for Coding Stats ---
export interface DailyStat {
    todayDate: string; // "YYYY-MM-DD"
    codingTimeMs: number;
}

export interface CodingStats {
    daily: DailyStat[];
    avgWeeklyCodingTime: number;
    maxWeeklyCodingTime: number;
    totalWeeklyCodingTime: number;
}

// Mock Data (Initial State)
const INITIAL_STATS: CodingStats = {
    daily: [
        { todayDate: "2025-12-15", codingTimeMs: 570000 },
        { todayDate: "2025-12-16", codingTimeMs: 0 },
        { todayDate: "2025-12-17", codingTimeMs: 291991 },
        { todayDate: "2025-12-18", codingTimeMs: 30000 },
        // ... assuming these are past dates
    ],
    avgWeeklyCodingTime: 43531,
    maxWeeklyCodingTime: 570000,
    totalWeeklyCodingTime: 59392084
};

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
    activeFile: { name: string; content: string; id: string } | null
    containerId: string | undefined
    // ... rest
    // Timer & Stats
    stats: CodingStats
    currentSessionMs: number
    getTodayTotalTime: () => number
    saveCodingSession: () => void
    setIsWorking: (isWorking: boolean) => void
    // File Actions
    setActiveId: (id: string | undefined) => void
    addFile: (parentId?: string) => void
    addFolder: (parentId?: string) => void
    deleteItem: (itemId: string) => void
    renameItem: (itemId: string, newName: string) => void
    updateFileContent: (content: string) => void
}

const WebICContext = createContext<WebICContextType | undefined>(undefined)

export const WebICContextProvider = ({ children, containerId }: { children: React.ReactNode; containerId?: string }) => {
    const { user } = useUser();
    const [files, setFiles] = useState<FileSystemItem[]>(initialFiles)
    const [activeId, setActiveId] = useState<string | undefined>('root-welcome')

    // --- Timer & Stats State ---
    const [stats, setStats] = useState<CodingStats>(INITIAL_STATS)
    const [currentSessionMs, setCurrentSessionMs] = useState(0)
    const [isWorkingState, setIsWorkingState] = useState(false)
    const [codingId, setCodingId] = useState<number | null>(null)

    // Fetch stats on mount
    useEffect(() => {
        const fetchStats = async () => {
            const today = new Date().toISOString().split('T')[0];
            try {
                const [dailyRes, weeklyRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/code/coding-stats/${today}`),
                    fetch(`${API_BASE_URL}/code/coding-stats/week?startDate=${today}`) // Simplified week fetch
                ]);

                if (dailyRes.ok && weeklyRes.ok) {
                    const dailyData = await dailyRes.json();
                    const weeklyData = await weeklyRes.json();
                    // Update stats with server data
                    setStats(prev => ({
                        ...prev,
                        daily: weeklyData.days || prev.daily, // Assume week API returns daily breakdown
                        totalWeeklyCodingTime: weeklyData.weekTotal || prev.totalWeeklyCodingTime
                    }));
                }
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            }
        };

        fetchStats();
    }, []);

    // Timer Logic: Increase session time every second ONLY when working
    useEffect(() => {
        let interval: NodeJS.Timeout
        if (isWorkingState) {
            interval = setInterval(() => {
                setCurrentSessionMs(prev => prev + 1000)
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [isWorkingState])

    const setIsWorking = useCallback(async (working: boolean) => {
        setIsWorkingState(working);

        const userId = user?.id ? parseInt(user.id.replace(/\D/g, '')) || 1 : 1;

        if (working) {
            // Start Session
            try {
                const res = await fetch(`${API_BASE_URL}/code/coding-time/start`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId })
                });
                if (res.ok) {
                    const data = await res.json();
                    setCodingId(data.codingId);
                }
            } catch (error) {
                console.error('Failed to start coding session:', error);
            }
        } else {
            // End Session
            if (codingId) {
                try {
                    await fetch(`${API_BASE_URL}/code/coding-time/end`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ codingId })
                    });
                    setCodingId(null);
                    saveCodingSession();
                } catch (error) {
                    console.error('Failed to end coding session:', error);
                }
            }
        }
    }, [user, codingId]);

    const getTodayTotalTime = useCallback(() => {
        const today = new Date().toISOString().split('T')[0];
        const match = stats.daily.find(d => d.todayDate === today);
        const serverTime = match ? match.codingTimeMs : 0;
        return serverTime + currentSessionMs;
    }, [stats, currentSessionMs])

    const saveCodingSession = useCallback(() => {
        const today = new Date().toISOString().split('T')[0];

        // Payload Construction
        const logPayload = {
            container_id: containerId ? (isNaN(Number(containerId)) ? containerId : Number(containerId)) : null,
            coding_time_ms: currentSessionMs,
            record_date: today
        };

        console.log(JSON.stringify(logPayload, null, 2));

        // Update Local State (Commit session to stats)
        setStats(prev => {
            const existingDayIndex = prev.daily.findIndex(d => d.todayDate === today);
            let newDaily = [...prev.daily];

            if (existingDayIndex >= 0) {
                newDaily[existingDayIndex] = {
                    ...newDaily[existingDayIndex],
                    codingTimeMs: newDaily[existingDayIndex].codingTimeMs + currentSessionMs
                };
            } else {
                newDaily.push({ todayDate: today, codingTimeMs: currentSessionMs });
            }

            return {
                ...prev,
                daily: newDaily,
                totalWeeklyCodingTime: prev.totalWeeklyCodingTime + currentSessionMs,
                avgWeeklyCodingTime: prev.avgWeeklyCodingTime, // Keep existing or calc logic
                maxWeeklyCodingTime: prev.maxWeeklyCodingTime
            };
        });

        // Reset Session
        setCurrentSessionMs(0);
    }, [currentSessionMs])

    // Active File Derived State
    const activeFile = useMemo(() => {
        if (!activeId) return null
        const item = findItem(files, activeId)
        if (item && item.type === 'file') {
            return { name: item.name, content: item.content || '', id: item.id }
        }
        return null
    }, [files, activeId])

    const checkDuplicate = (items: FileSystemItem[], parentId: string | undefined, name: string): boolean => {
        let siblings: FileSystemItem[] = items
        if (parentId) {
            const parent = findItem(items, parentId)
            if (parent && parent.children) {
                siblings = parent.children
            }
        }
        return siblings.some(item => item.name === name)
    }

    const getSiblings = (items: FileSystemItem[], targetId?: string, parentId?: string): FileSystemItem[] => {
        if (parentId) {
            const parent = findItem(items, parentId)
            return parent?.children || []
        }
        if (targetId) {
            const parent = findParent(items, targetId)
            return parent ? parent.children! : items
        }
        return items
    }

    // --- Actions ---

    // ... (rest of actions)


    // --- Actions ---

    const addFile = useCallback(async (parentId?: string) => {
        const name = prompt('파일 이름을 입력하세요')
        if (!name) return

        const path = parentId ? findItem(files, parentId)?.name || '' : '';

        try {
            const res = await fetch(`${API_BASE_URL}/file/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    container_id: containerId,
                    name,
                    path
                })
            });

            if (res.ok) {
                setFiles(prev => {
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
            }
        } catch (error) {
            console.error('Failed to create file:', error);
        }
    }, [containerId, files])

    const addFolder = useCallback(async (parentId?: string) => {
        const name = prompt('폴더 이름을 입력하세요')
        if (!name) return

        const path = parentId ? findItem(files, parentId)?.name || '' : '';

        try {
            const res = await fetch(`${API_BASE_URL}/file/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    container_id: containerId,
                    name,
                    path
                })
            });

            if (res.ok) {
                setFiles(prev => {
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
            }
        } catch (error) {
            console.error('Failed to create folder:', error);
        }
    }, [containerId, files])

    const deleteItem = useCallback(async (itemId: string) => {
        const item = findItem(files, itemId);
        if (!item) return;

        const path = findParent(files, itemId)?.name || '';

        try {
            const res = await fetch(`${API_BASE_URL}/file/delete`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    container_id: containerId,
                    name: item.name,
                    path
                })
            });

            if (res.ok) {
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
            }
        } catch (error) {
            console.error('Failed to delete item:', error);
        }
    }, [activeId, containerId, files])

    const renameItem = useCallback(async (itemId: string, newName: string) => {
        const item = findItem(files, itemId);
        if (!item) return;

        try {
            // Using /file/move for rename/move
            const res = await fetch(`${API_BASE_URL}/file/move`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    container_id: containerId,
                    file_id: itemId.startsWith('file-') ? parseInt(itemId.replace('file-', '')) : parseInt(itemId.replace('folder-', '')),
                    path: newName // Assuming path here is the new name/destination
                })
            });

            if (res.ok) {
                setFiles(prev => {
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
            }
        } catch (error) {
            console.error('Failed to rename item:', error);
        }
    }, [containerId, files])

    const updateFileContent = useCallback(async (content: string) => {
        if (!activeId || !activeFile) return

        const path = findParent(files, activeId)?.name || '';

        try {
            const res = await fetch(`${API_BASE_URL}/file/update`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    container_id: containerId,
                    name: activeFile.name,
                    path,
                    content // Customly adding content
                })
            });

            if (res.ok) {
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
            }
        } catch (error) {
            console.error('Failed to update file content:', error);
        }
    }, [activeId, activeFile, containerId, files])

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
            updateFileContent,
            stats,
            currentSessionMs,
            getTodayTotalTime,
            saveCodingSession,
            setIsWorking,
            containerId
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
