'use client'

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { useAuth, useUser } from '@clerk/nextjs'
import type { FileSystemItem } from '../types/fileTypes'
import { initialFiles } from '@/app/ide/lib/workspaceFiles'
import * as fileApi from '../services/fileApi'
import type { FileTreeResponse } from '../services/fileApi'

// API Configuration
const API_BASE_URL = '/api-proxy';

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

// findParent removed (unused)

interface WebICContextType {
    files: FileSystemItem[]
    activeId: string | undefined
    activeFile: { name: string; content: string; id: string } | null
    containerId: number | undefined
    stats: CodingStats
    currentSessionMs: number
    getTodayTotalTime: () => number
    saveCodingSession: () => Promise<void>
    setIsWorking: (working: boolean) => void
    setActiveId: (id: string | undefined) => void
    addFile: (parentId?: string) => Promise<void>
    addFolder: (parentId?: string) => Promise<void>
    deleteItem: (itemId: string) => Promise<void>
    renameItem: (itemId: string, newName: string) => Promise<void>
    moveItem: (itemId: string, targetParentId?: string) => Promise<void>
    loadFileContent: (fileId: string) => Promise<void>
    saveFileContent: (content?: string) => Promise<void>
    updateFileContent: (content: string) => void
    refreshFileTree: () => Promise<void>
}

const WebICContext = createContext<WebICContextType | undefined>(undefined)

export const WebICContextProvider = ({ children, containerId }: { children: React.ReactNode; containerId?: number }) => {
    const { getToken } = useAuth();
    const { user } = useUser();
    const [files, setFiles] = useState<FileSystemItem[]>([])
    const [activeId, setActiveId] = useState<string | undefined>(undefined)
    // isLoadingFiles removed (unused)

    // --- Timer & Stats State ---
    const [stats, setStats] = useState<CodingStats>(INITIAL_STATS)
    const [currentSessionMs, setCurrentSessionMs] = useState(0)
    const [baseTimeToday, setBaseTimeToday] = useState(0)
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

    // Helper: Convert FileTreeResponse to FileSystemItem
    const convertTreeToFileSystem = useCallback((node: FileTreeResponse): FileSystemItem => {
        return {
            id: `file-${node.id}`,
            serverId: node.id,
            name: node.name,
            type: node.isDirectory ? 'folder' : 'file',
            path: node.path,
            extension: node.extension,
            createdAt: node.createdAt,
            updatedAt: node.updatedAt,
            isOpen: false,
            children: node.children?.map(child => convertTreeToFileSystem(child)) || (node.isDirectory ? [] : undefined)
        };
    }, []);

    // 0. Load File Tree from Server
    const refreshFileTree = useCallback(async () => {
        if (!containerId || isNaN(containerId)) {
            console.warn('⚠️ containerId가 유효하지 않아 파일 트리를 로드할 수 없습니다. (containerId:', containerId, ')');
            setFiles(initialFiles);
            return;
        }

        try {
            console.group('🌳 파일 트리 로드');
            console.log('containerId:', containerId);

            const token = await getToken();
            const response = await fileApi.getFileTree(containerId, token || undefined);

            if (response.data && Array.isArray(response.data)) {
                const fileSystemItems = response.data.map(node => convertTreeToFileSystem(node));
                setFiles(fileSystemItems);
                console.log('✅ 파일 트리 로드 완료:', fileSystemItems.length, '개 항목');
            } else {
                console.warn('⚠️ 빈 파일 트리 응답');
                setFiles([]);
            }
        } catch (error) {
            console.error('❌ 파일 트리 로드 실패:', error);
            // Fallback to initial files
            setFiles(initialFiles);
        } finally {
            console.groupEnd();
        }
    }, [containerId, convertTreeToFileSystem, getToken]);

    useEffect(() => {
        refreshFileTree();
    }, [refreshFileTree]);

    // 1. Fetch Stats (최상단)
    useEffect(() => {
        const fetchStats = async () => {
            try {
                console.group('📊 코딩 통계 조회 요청');
                console.log('Endpoint:', `${API_BASE_URL}/code/coding-stats`);

                const token = await getToken();

                // 백엔드 스펙: GET /code/coding-stats (주별 통계)
                const res = await fetch(`${API_BASE_URL}/code/coding-stats`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }).catch(() => null);

                if (res?.ok) {
                    const weeklyData = await res.json();
                    console.log('✅ 통계 수신 결과:', weeklyData);

                    // baseTimeToday 설정 (오늘 날짜 데이터 찾기)
                    const today = new Date().toISOString().split('T')[0];
                    const todayStat = weeklyData.daily?.find((d: DailyStat) => d.todayDate === today);

                    if (todayStat) {
                        setBaseTimeToday(todayStat.codingTimeMs || 0);
                        console.log('📍 오늘 누적 시간:', todayStat.codingTimeMs, 'ms');
                    }

                    setStats({
                        daily: weeklyData.daily || [],
                        avgWeeklyCodingTime: weeklyData.avgWeeklyCodingTime || 0,
                        maxWeeklyCodingTime: weeklyData.maxWeeklyCodingTime || 0,
                        totalWeeklyCodingTime: weeklyData.totalWeeklyCodingTime || 0
                    });
                } else {
                    console.warn('⚠️ 통계 조회 실패 (Status:', res?.status, ')');
                }
            } catch (error) {
                console.error('❌ 통계 로딩 에러:', error);
            } finally {
                console.groupEnd();
            }
        };

        fetchStats();
    }, [getToken]);

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
        return baseTimeToday + currentSessionMs;
    }, [baseTimeToday, currentSessionMs])

    // 4. Save Coding Session API
    const saveCodingSession = useCallback(async () => {
        const today = new Date().toISOString().split('T')[0];
        const totalMs = getTodayTotalTime();

        const payload = {
            containerId: containerId || 0,
            codingTimeMs: totalMs,
            recordDate: today
        };

        try {
            console.group('💾 코딩 세션 최종 저장');
            console.log('Payload:', payload);

            const token = await getToken();

            const res = await fetch(`${API_BASE_URL}/code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                console.log('✅ 세션 저장 성공');
                setStats(prev => {
                    const newDaily = [...prev.daily];
                    const idx = newDaily.findIndex(d => d.todayDate === today);
                    if (idx >= 0) newDaily[idx] = { ...newDaily[idx], codingTimeMs: totalMs };
                    else newDaily.push({ todayDate: today, codingTimeMs: totalMs });
                    return { ...prev, daily: newDaily };
                });
                setBaseTimeToday(totalMs);
                setCurrentSessionMs(0);
            } else {
                console.error('❌ 세션 저장 실패 (Status:', res.status, ')');
            }
        } catch (error) {
            console.error('❌ 세션 저장 에러:', error);
            console.groupEnd();
        }
    }, [getTodayTotalTime, containerId, getToken]);

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
                console.group('🚀 코딩 세션 시작');
                console.log('UserId:', userId);

                const token = await getToken();

                const res = await fetch(`${API_BASE_URL}/code`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ userId })
                });
                if (res.ok) {
                    const data = await res.json();
                    console.log('✅ 세션 시작 성공, codingId:', data.codingId);
                    setCodingId(data.codingId);
                } else {
                    console.error('❌ 세션 시작 실패 (Status:', res.status, ')');
                }
            } catch (err) {
                console.error('❌ 세션 시작 에러:', err);
            } finally {
                isRequestingStart.current = false;
                console.groupEnd();
            }
        } else {
            if (isRequestingEnd.current || !codingId) return;
            isRequestingEnd.current = true;
            try {
                console.group('🏁 코딩 세션 종료');
                console.log('CodingId:', codingId);

                const token = await getToken();

                await fetch(`${API_BASE_URL}/code`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ codingId })
                });
                console.log('✅ 세션 종료 처리 완료');
                setCodingId(null);
                await saveCodingSession();
            } catch (err) {
                console.error('❌ 세션 종료 에러:', err);
            } finally {
                isRequestingEnd.current = false;
                console.groupEnd();
            }
        }
    }, [user, codingId, saveCodingSession, getToken]);

    // 6. File Save Content
    const saveFileContent = useCallback(async (content?: string) => {
        if (!activeId || !activeFile) return;

        const item = findItem(files, activeId);
        if (!item || !item.serverId) {
            console.warn('저장할 파일을 찾을 수 없거나 serverId가 없습니다.');
            return;
        }

        const contentToSave = content !== undefined ? content : activeFile.content;

        try {
            console.group('💾 파일 저장');
            console.log('파일명:', activeFile.name);
            console.log('서버 ID:', item.serverId);
            console.log('내용 길이:', contentToSave.length, 'characters');

            const request: fileApi.FileUpdateRequest = {
                newContent: contentToSave
            };

            console.log('📤 API 요청');
            const token = await getToken();
            const response = await fileApi.updateFile(item.serverId, request, token || undefined);
            console.log('✅ API 응답:', response.data);

            // Also save coding session time
            await saveCodingSession();

            console.log('✅ 파일 저장 완료');
        } catch (error) {
            console.error('❌ 파일 저장 실패:', error);
            alert('파일 저장에 실패했습니다.');
            console.groupEnd();
        }
    }, [activeId, activeFile, files, saveCodingSession, getToken]);


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
        if (!containerId) {
            alert('containerId가 없습니다.');
            return;
        }

        try {
            console.group('📝 파일 생성');
            console.log('파일명:', name);
            console.log('부모 ID:', parentId);

            const parentItem = parentId ? findItem(files, parentId) : null;
            const serverParentId = parentItem?.serverId || null;

            const request: fileApi.FileCreateRequest = {
                containerId,
                name,
                parentId: serverParentId,
                content: ''
            };

            console.log('📤 API 요청:', request);
            const token = await getToken();
            const response = await fileApi.createFile(request, token || undefined);
            console.log('✅ API 응답:', response.data);

            if (response.data) {
                const newFile: FileSystemItem = {
                    id: `file-${response.data.id}`,
                    serverId: response.data.id,
                    name: response.data.fileName,
                    type: 'file',
                    content: '',
                    path: response.data.filePath,
                    extension: response.data.fileExtension,
                    createdAt: response.data.createdAt,
                    updatedAt: response.data.updatedAt
                };

                setFiles(prev => {
                    if (!parentId) return [...prev, newFile]
                    const updateTree = (items: FileSystemItem[]): FileSystemItem[] => {
                        return items.map(item => {
                            if (item.id === parentId) {
                                return { ...item, children: [...(item.children || []), newFile], isOpen: true }
                            }
                            if (item.children) return { ...item, children: updateTree(item.children) }
                            return item
                        })
                    }
                    return updateTree(prev)
                });

                console.log('✅ 파일 생성 완료:', newFile.name);
            }
        } catch (error) {
            console.error('❌ 파일 생성 실패:', error);
            alert('파일 생성에 실패했습니다.');
        } finally {
            console.groupEnd();
        }
    }, [containerId, files, getToken]);

    const addFolder = useCallback(async (parentId?: string) => {
        const name = prompt('폴더 이름을 입력하세요')
        if (!name) return
        if (!containerId) {
            alert('containerId가 없습니다.');
            return;
        }

        try {
            console.group('📁 폴더 생성');
            console.log('폴더명:', name);
            console.log('부모 ID:', parentId);

            const parentItem = parentId ? findItem(files, parentId) : null;
            const serverParentId = parentItem?.serverId || null;

            const request: fileApi.FileCreateRequest = {
                containerId,
                name,  // 확장자 없으면 폴더로 인식됨
                parentId: serverParentId
            };

            console.log('📤 API 요청:', request);
            const token = await getToken();
            const response = await fileApi.createFile(request, token || undefined);
            console.log('✅ API 응답:', response.data);

            if (response.data) {
                const newFolder: FileSystemItem = {
                    id: `folder-${response.data.id}`,
                    serverId: response.data.id,
                    name: response.data.fileName,
                    type: 'folder',
                    children: [],
                    isOpen: true,
                    path: response.data.filePath,
                    createdAt: response.data.createdAt,
                    updatedAt: response.data.updatedAt
                };

                setFiles(prev => {
                    if (!parentId) return [...prev, newFolder]
                    const updateTree = (items: FileSystemItem[]): FileSystemItem[] => {
                        return items.map(item => {
                            if (item.id === parentId) {
                                return { ...item, children: [...(item.children || []), newFolder], isOpen: true }
                            }
                            if (item.children) return { ...item, children: updateTree(item.children) }
                            return item
                        })
                    }
                    return updateTree(prev)
                });

                console.log('✅ 폴더 생성 완료:', newFolder.name);
            }
        } catch (error) {
            console.error('❌ 폴더 생성 실패:', error);
            alert('폴더 생성에 실패했습니다.');
        } finally {
            console.groupEnd();
        }
    }, [containerId, files, getToken]);

    const deleteItem = useCallback(async (itemId: string) => {
        const item = findItem(files, itemId)
        if (!item || !item.serverId || !containerId) {
            console.warn('삭제할 항목을 찾을 수 없거나 serverId가 없습니다.');
            return;
        }

        if (!confirm(`"${item.name}"을(를) 삭제하시겠습니까?`)) return;

        try {
            console.group('🗑️ 아이템 삭제');
            console.log('파일명:', item.name);
            console.log('서버 ID:', item.serverId);

            const token = await getToken();
            const response = await fileApi.removeFile(item.serverId, containerId || 0, token || undefined);
            console.log('✅ API 응답:', response.data);

            setFiles(prev => {
                const del = (items: FileSystemItem[]): FileSystemItem[] =>
                    items.filter(i => i.id !== itemId).map(i => i.children ? { ...i, children: del(i.children) } : i)
                return del(prev)
            });

            if (activeId === itemId) setActiveId(undefined);
            console.log('✅ 삭제 완료:', item.name);
        } catch (error) {
            console.error('❌ 삭제 실패:', error);
            alert('삭제에 실패했습니다.');
        } finally {
            console.groupEnd();
        }
    }, [files, containerId, activeId, getToken]);

    const renameItem = useCallback(async (itemId: string, newName: string) => {
        const item = findItem(files, itemId);
        if (!item || !item.serverId) {
            console.warn('이름을 변경할 항목을 찾을 수 없거나 serverId가 없습니다.');
            return;
        }

        try {
            console.group('✏️ 이름 변경');
            console.log('기존 이름:', item.name, '-> 새 이름:', newName);
            console.log('서버 ID:', item.serverId);

            const request: fileApi.FileUpdateRequest = {
                newName
            };

            console.log('📤 API 요청:', request);
            const token = await getToken();
            const response = await fileApi.updateFile(item.serverId, request, token || undefined);
            console.log('✅ API 응답:', response.data);

            setFiles(prev => {
                const up = (items: FileSystemItem[]): FileSystemItem[] =>
                    items.map(i => i.id === itemId ? { ...i, name: newName } : (i.children ? { ...i, children: up(i.children) } : i))
                return up(prev)
            });

            console.log('✅ 이름 변경 완료');
        } catch (error) {
            console.error('❌ 이름 변경 실패:', error);
            alert('이름 변경에 실패했습니다.');
        } finally {
            console.groupEnd();
        }
    }, [files, getToken]);

    const moveItem = useCallback(async (itemId: string, targetParentId?: string) => {
        const item = findItem(files, itemId);
        if (!item || !item.serverId) {
            console.warn('이동할 항목을 찾을 수 없거나 serverId가 없습니다.');
            return;
        }

        try {
            console.group('📦 파일/폴더 이동');
            console.log('파일명:', item.name);
            console.log('서버 ID:', item.serverId);
            console.log('대상 부모 ID:', targetParentId);

            const targetParent = targetParentId ? findItem(files, targetParentId) : null;
            const serverTargetParentId = targetParent?.serverId || null;

            const request: fileApi.FileMoveRequest = {
                targetParentId: serverTargetParentId
            };

            console.log('📤 API 요청:', request);
            const token = await getToken();
            const response = await fileApi.moveFile(item.serverId, request, token || undefined);
            console.log('✅ API 응답:', response.data);

            // Refresh the entire file tree to reflect the move
            await refreshFileTree();
            console.log('✅ 이동 완료:', item.name);
        } catch (error) {
            console.error('❌ 이동 실패:', error);
            alert('파일/폴더 이동에 실패했습니다.');
        } finally {
            console.groupEnd();
        }
    }, [files, refreshFileTree, getToken]);

    const loadFileContent = useCallback(async (fileId: string) => {
        const item = findItem(files, fileId);
        if (!item || !item.serverId || item.type !== 'file') {
            console.warn('파일을 찾을 수 없거나 serverId가 없습니다.');
            return;
        }

        try {
            console.group('📄 파일 내용 로드');
            console.log('파일명:', item.name);
            console.log('서버 ID:', item.serverId);

            console.log('📤 API 요청');
            const token = await getToken();
            const response = await fileApi.getFileContent(item.serverId, token || undefined);
            console.log('✅ API 응답:', response.data);

            if (response.data) {
                // Update file content in local state
                setFiles(prev => {
                    const updateContent = (items: FileSystemItem[]): FileSystemItem[] =>
                        items.map(i =>
                            i.id === fileId
                                ? { ...i, content: response.data.content }
                                : (i.children ? { ...i, children: updateContent(i.children) } : i)
                        );
                    return updateContent(prev);
                });

                console.log('✅ 파일 내용 로드 완료');
            }
        } catch (error) {
            console.error('❌ 파일 내용 로드 실패:', error);
        } finally {
            console.groupEnd();
        }
    }, [files, getToken]);

    return (
        <WebICContext.Provider value={{
            files, activeId, activeFile, setActiveId, addFile, addFolder, deleteItem,
            renameItem, moveItem, loadFileContent, updateFileContent, stats, currentSessionMs,
            getTodayTotalTime, saveCodingSession, saveFileContent, setIsWorking, containerId,
            refreshFileTree
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
