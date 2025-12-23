'use client'

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect, useRef } from 'react'
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

const INITIAL_STATS: CodingStats = {
    daily: [],
    avgWeeklyCodingTime: 0,
    maxWeeklyCodingTime: 0,
    totalWeeklyCodingTime: 0
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
    stats: CodingStats
    currentSessionMs: number
    getTodayTotalTime: () => number
    saveCodingSession: () => Promise<void>
    setIsWorking: (working: boolean) => void
    setActiveId: (id: string | undefined) => void
    addFile: (parentId?: string) => void
    addFolder: (parentId?: string) => void
    deleteItem: (itemId: string) => void
    renameItem: (itemId: string, newName: string) => void
    saveFileContent: (content?: string) => Promise<void>
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

    // activeFile을 사용하기 전에 미리 선언 (TDZ 방지)
    const activeFile = useMemo(() => {
        if (!activeId) return null
        const item = findItem(files, activeId)
        if (item && item.type === 'file') {
            return { name: item.name, content: item.content || '', id: item.id }
        }
        return null
    }, [files, activeId])

    // API 호출 중복 및 상태 체크를 위한 Refs
    const isWorkingRef = useRef(false);
    const isRequestingStart = useRef(false);
    const isRequestingEnd = useRef(false);

    // 1. Fetch Stats (최상단)
    useEffect(() => {
        const fetchStats = async () => {
            const today = new Date().toISOString().split('T')[0];
            try {
                const [dailyRes, weeklyRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/code/coding-stats/${today}`).catch(() => null),
                    fetch(`${API_BASE_URL}/code/coding-stats/week?startDate=${today}`).catch(() => null)
                ]);

                if (dailyRes?.ok && weeklyRes?.ok) {
                    const dailyData = await dailyRes.json();
                    const weeklyData = await weeklyRes.json();
                    setStats(prev => ({
                        ...prev,
                        daily: weeklyData.days || prev.daily,
                        totalWeeklyCodingTime: weeklyData.weekTotal || prev.totalWeeklyCodingTime
                    }));
                }
            } catch (error) {
                console.error('통계 로딩 실패:', error);
            }
        };

        fetchStats();
    }, []);

    // 2. Timer Logic
    useEffect(() => {
        let interval: NodeJS.Timeout
        if (isWorkingState) {
            interval = setInterval(() => {
                setCurrentSessionMs(prev => prev + 1000)
            }, 1000)
        }
        return () => {
            if (interval) clearInterval(interval)
        }
    }, [isWorkingState])

    // 3. Helper: Today Total Time
    const getTodayTotalTime = useCallback(() => {
        const today = new Date().toISOString().split('T')[0];
        const match = stats.daily.find(d => d.todayDate === today);
        const serverTime = match ? match.codingTimeMs : 0;
        return serverTime + currentSessionMs;
    }, [stats, currentSessionMs])

    // 4. Save Coding Session API
    const saveCodingSession = useCallback(async () => {
        const today = new Date().toISOString().split('T')[0];
        const totalMs = getTodayTotalTime();

        const payload = {
            containerId: containerId ? Number(containerId) : 0,
            codingTimeMs: totalMs,
            recordDate: today
        };

        try {
            const res = await fetch(`${API_BASE_URL}/code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setStats(prev => {
                    const newDaily = [...prev.daily];
                    const idx = newDaily.findIndex(d => d.todayDate === today);
                    if (idx >= 0) newDaily[idx] = { ...newDaily[idx], codingTimeMs: totalMs };
                    else newDaily.push({ todayDate: today, codingTimeMs: totalMs });
                    return { ...prev, daily: newDaily };
                });
                setCurrentSessionMs(0);
            }
        } catch (error) {
            console.error('세션 저장 실패:', error);
        }
    }, [getTodayTotalTime, containerId]);

    // 5. setIsWorking
    const setIsWorking = useCallback(async (working: boolean) => {
        // Ref를 사용해 최신 상태와 비교 (Stale closure 문제 해결)
        if (working === isWorkingRef.current) return;

        isWorkingRef.current = working;
        setIsWorkingState(working);

        const userId = user?.id ? parseInt(user.id.replace(/\D/g, '')) || 1 : 1;

        if (working) {
            if (isRequestingStart.current) return;
            isRequestingStart.current = true;
            try {
                const res = await fetch(`${API_BASE_URL}/code`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId })
                });
                if (res.ok) {
                    const data = await res.json();
                    setCodingId(data.codingId);
                }
            } catch (err) {
                console.error('세션 시작 API 에러:', err);
            } finally {
                isRequestingStart.current = false;
            }
        } else {
            if (isRequestingEnd.current || !codingId) return;
            isRequestingEnd.current = true;
            try {
                await fetch(`${API_BASE_URL}/code`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ codingId })
                });
                setCodingId(null);
                await saveCodingSession();
            } catch (err) {
                console.error('세션 종료 API 에러:', err);
            } finally {
                isRequestingEnd.current = false;
            }
        }
    }, [user, codingId, saveCodingSession]);

    // 6. File Save Content (통합 페이로드)
    const saveFileContent = useCallback(async (content?: string) => {
        if (!activeId || !activeFile) return

        const contentToSave = content !== undefined ? content : activeFile.content;
        const parent = findParent(files, activeId);
        const path = parent ? parent.name : '';
        const today = new Date().toISOString().split('T')[0];
        const totalMs = getTodayTotalTime();

        const payload = {
            containerId: containerId ? Number(containerId) : 0,
            name: activeFile.name,
            path,
            content: contentToSave,
            codingTimeMs: totalMs,
            recordDate: today
        };

        console.group(`%c 📤 서버 전송 시도: ${activeFile.name}`, 'color: #ff9800; font-weight: bold;');
        console.log("전송 데이터:", payload);
        console.groupEnd();

        try {
            const res = await fetch(`${API_BASE_URL}/file/update`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                console.log(`%c ✅ 서버 저장 완료`, 'color: #2196f3; font-weight: bold;');
                setStats(prev => {
                    const newDaily = [...prev.daily];
                    const idx = newDaily.findIndex(d => d.todayDate === today);
                    if (idx >= 0) newDaily[idx] = { ...newDaily[idx], codingTimeMs: totalMs };
                    else newDaily.push({ todayDate: today, codingTimeMs: totalMs });
                    return { ...prev, daily: newDaily };
                });
                setCurrentSessionMs(0);
            } else {
                console.error('서버 저장 실패:', res.status);
            }
        } catch (error) {
            console.error('네트워크 에러:', error);
        }
    }, [getTodayTotalTime, activeId, activeFile, files, containerId]);


    const updateFileContent = useCallback((content: string) => {
        setFiles(prev => {
            const updateRecursive = (items: FileSystemItem[]): FileSystemItem[] => {
                return items.map(item => {
                    if (item.id === activeId) return { ...item, content }
                    if (item.children) return { ...item, children: updateRecursive(item.children) }
                    return item
                })
            }
            return updateRecursive(prev)
        })
    }, [activeId]);

    const addFile = useCallback(async (parentId?: string) => {
        const name = prompt('파일 이름을 입력하세요')
        if (!name) return
        try {
            const res = await fetch(`${API_BASE_URL}/file/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ container_id: containerId, name, path: '' })
            });
            if (res.ok) {
                const newFile: FileSystemItem = { id: `file-${Date.now()}`, name, type: 'file', content: '' }
                setFiles(prev => {
                    if (!parentId) return [...prev, newFile]
                    const updateTree = (items: FileSystemItem[]): FileSystemItem[] => {
                        return items.map(item => {
                            if (item.id === parentId) return { ...item, children: [...(item.children || []), newFile], isOpen: true }
                            if (item.children) return { ...item, children: updateTree(item.children) }
                            return item
                        })
                    }
                    return updateTree(prev)
                })
            }
        } catch (e) { console.error(e) }
    }, [containerId]);

    const addFolder = useCallback(async (parentId?: string) => {
        const name = prompt('폴더 이름을 입력하세요')
        if (!name) return
        try {
            const res = await fetch(`${API_BASE_URL}/file/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ container_id: containerId, name, path: '' })
            });
            if (res.ok) {
                const newFolder: FileSystemItem = { id: `folder-${Date.now()}`, name, type: 'folder', children: [], isOpen: true }
                setFiles(prev => {
                    if (!parentId) return [...prev, newFolder]
                    const updateTree = (items: FileSystemItem[]): FileSystemItem[] => {
                        return items.map(item => {
                            if (item.id === parentId) return { ...item, children: [...(item.children || []), newFolder], isOpen: true }
                            if (item.children) return { ...item, children: updateTree(item.children) }
                            return item
                        })
                    }
                    return updateTree(prev)
                })
            }
        } catch (e) { console.error(e) }
    }, [containerId]);

    const deleteItem = useCallback(async (itemId: string) => {
        const item = findItem(files, itemId)
        if (!item) return
        try {
            const res = await fetch(`${API_BASE_URL}/file/delete`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ container_id: containerId, name: item.name, path: '' })
            });
            if (res.ok) {
                setFiles(prev => {
                    const del = (items: FileSystemItem[]): FileSystemItem[] =>
                        items.filter(i => i.id !== itemId).map(i => i.children ? { ...i, children: del(i.children) } : i)
                    return del(prev)
                })
                if (activeId === itemId) setActiveId(undefined)
            }
        } catch (e) { console.error(e) }
    }, [files, containerId, activeId]);

    const renameItem = useCallback(async (itemId: string, newName: string) => {
        try {
            const res = await fetch(`${API_BASE_URL}/file/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ container_id: containerId, file_id: parseInt(itemId.replace(/\D/g, '') || '0'), path: newName })
            });
            if (res.ok) {
                setFiles(prev => {
                    const up = (items: FileSystemItem[]): FileSystemItem[] =>
                        items.map(i => i.id === itemId ? { ...i, name: newName } : (i.children ? { ...i, children: up(i.children) } : i))
                    return up(prev)
                })
            }
        } catch (e) { console.error(e) }
    }, [containerId]);

    return (
        <WebICContext.Provider value={{
            files, activeId, activeFile, setActiveId, addFile, addFolder, deleteItem,
            renameItem, updateFileContent, stats, currentSessionMs, getTodayTotalTime,
            saveCodingSession, saveFileContent, setIsWorking, containerId
        }}>
            {children}
        </WebICContext.Provider>
    )
}

export const useWebIC = () => {
    const context = useContext(WebICContext)
    if (context === undefined) throw new Error('useWebIC must be used within a WebICContextProvider')
    return context
}
