'use client'

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef
} from 'react'
import { useUser, useAuth } from '@clerk/nextjs'
import type { FileSystemItem } from '../types/fileTypes'
import { initialFiles } from '@/app/ide/lib/workspaceFiles'
import {
  fetchFileTree,
  fetchFileContent,
  createFile,
  moveFile,
  removeFile
} from '@/lib/api/file'

// API Configuration
const API_BASE_URL = 'https://api.webicapp.com'

// --- Types for Coding Stats ---
export interface DailyStat {
  todayDate: string
  codingTimeMs: number
}

export interface CodingStats {
  daily: DailyStat[]
  avgWeeklyCodingTime: number
  maxWeeklyCodingTime: number
  totalWeeklyCodingTime: number
}

const INITIAL_STATS: CodingStats = {
  daily: [],
  avgWeeklyCodingTime: 0,
  maxWeeklyCodingTime: 0,
  totalWeeklyCodingTime: 0
}

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

const expandFolders = (items: FileSystemItem[]): FileSystemItem[] => {
  return items.map(item => ({
    ...item,
    isOpen: item.type === 'folder' ? item.isOpen ?? true : undefined,
    children: item.children ? expandFolders(item.children) : undefined
  }))
}

const findFirstFile = (items: FileSystemItem[]): FileSystemItem | undefined => {
  for (const item of items) {
    if (item.type === 'file') return item
    if (item.children) {
      const child = findFirstFile(item.children)
      if (child) return child
    }
  }
  return undefined
}

const tryInsertNode = (
  items: FileSystemItem[],
  parentId: string,
  newNode: FileSystemItem
): { items: FileSystemItem[]; inserted: boolean } => {
  let inserted = false
  const updated = items.map(item => {
    if (item.id === parentId) {
      inserted = true
      return {
        ...item,
        isOpen: true,
        children: [...(item.children ?? []), newNode]
      }
    }
    if (item.children) {
      const childResult = tryInsertNode(item.children, parentId, newNode)
      if (childResult.inserted) {
        inserted = true
        return { ...item, children: childResult.items }
      }
    }
    return item
  })
  return { items: updated, inserted }
}

const insertNode = (
  items: FileSystemItem[],
  parentId: string | undefined,
  newNode: FileSystemItem
): FileSystemItem[] => {
  if (!parentId) {
    return [...items, newNode]
  }

  const result = tryInsertNode(items, parentId, newNode)
  if (result.inserted) {
    return result.items
  }

  return [...items, newNode]
}

const removeNodeById = (items: FileSystemItem[], targetId: string): FileSystemItem[] => {
  return items
    .filter(item => item.id !== targetId)
    .map(item => ({
      ...item,
      children: item.children ? removeNodeById(item.children, targetId) : undefined
    }))
}

const updateNodeNameInTree = (
  items: FileSystemItem[],
  targetId: string,
  newName: string
): FileSystemItem[] => {
  return items.map(item => {
    if (item.id === targetId) {
      return { ...item, name: newName }
    }
    if (item.children) {
      return { ...item, children: updateNodeNameInTree(item.children, targetId, newName) }
    }
    return item
  })
}

const updateNodeContentInTree = (
  items: FileSystemItem[],
  targetId: string,
  content: string
): FileSystemItem[] => {
  return items.map(item => {
    if (item.id === targetId) {
      return { ...item, content }
    }
    if (item.children) {
      return { ...item, children: updateNodeContentInTree(item.children, targetId, content) }
    }
    return item
  })
}

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
  addFile: (parentId?: string) => void
  addFolder: (parentId?: string) => void
  deleteItem: (itemId: string) => void
  renameItem: (itemId: string, newName: string) => void
  saveFileContent: (content?: string) => Promise<void>
  updateFileContent: (content: string) => void
}

const WebICContext = createContext<WebICContextType | undefined>(undefined)

export const WebICContextProvider = ({ children, containerId }: { children: React.ReactNode; containerId?: number }) => {
  const { user } = useUser()
  const { getToken, isSignedIn } = useAuth()
  const [files, setFiles] = useState<FileSystemItem[]>(initialFiles)
  const [activeId, setActiveId] = useState<string | undefined>('root-welcome')

  // --- Timer & Stats State ---
  const [stats, setStats] = useState<CodingStats>(INITIAL_STATS)
  const [currentSessionMs, setCurrentSessionMs] = useState(0)
  const [baseTimeToday, setBaseTimeToday] = useState(0)
  const [isWorkingState, setIsWorkingState] = useState(false)
  const [codingId, setCodingId] = useState<number | null>(null)

  const activeFile = useMemo(() => {
    if (!activeId) return null
    const item = findItem(files, activeId)
    if (item && item.type === 'file') {
      return { name: item.name, content: item.content || '', id: item.id }
    }
    return null
  }, [files, activeId])

  const activeItem = useMemo(() => {
    if (!activeId) return null
    return findItem(files, activeId) ?? null
  }, [files, activeId])

  // API 호출 중복 및 상태 체크를 위한 Refs
  const isWorkingRef = useRef(false)
  const isRequestingStart = useRef(false)
  const isRequestingEnd = useRef(false)

  // 1. Fetch Stats (최상단)
  useEffect(() => {
    const fetchStats = async () => {
      const today = new Date().toISOString().split('T')[0]
      try {
        const [dailyRes, weeklyRes] = await Promise.all([
          fetch(`${API_BASE_URL}/code/coding-stats/${today}`).catch(() => null),
          fetch(`${API_BASE_URL}/code/coding-stats/week?startDate=${today}`).catch(() => null)
        ])

        if (dailyRes?.ok && weeklyRes?.ok) {
          const dailyData = await dailyRes.json()
          const weeklyData = await weeklyRes.json()

          setBaseTimeToday(dailyData.codingTimeMs || 0)
          setStats(prev => ({
            ...prev,
            daily: weeklyData.days || prev.daily,
            totalWeeklyCodingTime: weeklyData.weekTotal || prev.totalWeeklyCodingTime
          }))
        }
      } catch (error) {
        console.error('통계 로딩 실패:', error)
      }
    }

    fetchStats()
  }, [])

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
    return baseTimeToday + currentSessionMs
  }, [baseTimeToday, currentSessionMs])

  // 4. Save Coding Session API
  const saveCodingSession = useCallback(async () => {
    const today = new Date().toISOString().split('T')[0]
    const totalMs = getTodayTotalTime()

    const payload = {
      containerId: containerId || 0,
      codingTimeMs: totalMs,
      recordDate: today
    }

    try {
      const res = await fetch(`${API_BASE_URL}/code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        setStats(prev => {
          const newDaily = [...prev.daily]
          const idx = newDaily.findIndex(d => d.todayDate === today)
          if (idx >= 0) newDaily[idx] = { ...newDaily[idx], codingTimeMs: totalMs }
          else newDaily.push({ todayDate: today, codingTimeMs: totalMs })
          return { ...prev, daily: newDaily }
        })
        setBaseTimeToday(totalMs)
        setCurrentSessionMs(0)
      }
    } catch (error) {
      console.error('세션 저장 실패:', error)
    }
  }, [getTodayTotalTime, containerId])

  // 5. setIsWorking
  const setIsWorking = useCallback(async (working: boolean) => {
    if (working === isWorkingRef.current) return

    isWorkingRef.current = working
    setIsWorkingState(working)

    const userId = user?.id ? parseInt(user.id.replace(/\D/g, '')) || 1 : 1

    if (working) {
      if (isRequestingStart.current) return
      isRequestingStart.current = true
      try {
        const res = await fetch(`${API_BASE_URL}/code`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        })
        if (res.ok) {
          const data = await res.json()
          setCodingId(data.codingId)
        }
      } catch (err) {
        console.error('세션 시작 API 에러:', err)
      } finally {
        isRequestingStart.current = false
      }
    } else {
      if (isRequestingEnd.current || !codingId) return
      isRequestingEnd.current = true
      try {
        await fetch(`${API_BASE_URL}/code`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ codingId })
        })
        setCodingId(null)
        await saveCodingSession()
      } catch (err) {
        console.error('세션 종료 API 에러:', err)
      } finally {
        isRequestingEnd.current = false
      }
    }
  }, [user, codingId, saveCodingSession])

  // --- File Tree Loading & Content Fetching ---
  useEffect(() => {
    if (!isSignedIn) return

    let isMounted = true

    const loadTree = async () => {
      try {
        const token = await getToken({ template: 'jwt' })
        if (!token || !isMounted) return

        const tree = await fetchFileTree({ token, containerId })
        if (!isMounted) return

        const expandedTree = expandFolders(tree)
        setFiles(expandedTree)
        setActiveId(prev => {
          if (prev && findItem(expandedTree, prev)) {
            return prev
          }
          const firstFile = findFirstFile(expandedTree)
          return firstFile?.id ?? prev
        })
      } catch (error) {
        console.error('파일 트리 로딩 실패:', error)
      }
    }

    loadTree()

    return () => {
      isMounted = false
    }
  }, [containerId, getToken, isSignedIn])

  useEffect(() => {
    if (!activeItem || activeItem.type !== 'file' || activeItem.content !== undefined) return

    let cancelled = false

    const loadContent = async () => {
      if (!isSignedIn) return
      const token = await getToken({ template: 'jwt' })
      if (!token || cancelled) return

      try {
        const { content } = await fetchFileContent({ token, fileId: activeItem.id })
        if (cancelled) return
        setFiles(prev => updateNodeContentInTree(prev, activeItem.id, content))
      } catch (error) {
        console.error(`파일 내용 로딩 실패 (${activeItem.id}):`, error)
      }
    }

    loadContent()

    return () => {
      cancelled = true
    }
  }, [activeItem, getToken, isSignedIn])

  const addFile = useCallback(async (parentId?: string) => {
    const name = prompt('파일 이름을 입력하세요')
    if (!name) return

    if (!isSignedIn) {
      console.warn('로그인 후 파일을 생성할 수 있습니다.')
      return
    }

    const token = await getToken({ template: 'jwt' })
    if (!token) {
      console.warn('Clerk 토큰이 없습니다 (파일 생성 생략됨)')
      return
    }

    try {
      const created = await createFile({
        token,
        containerId,
        parentId,
        name,
        isFolder: false
      })
      setFiles(prev => insertNode(prev, parentId, created))
    } catch (error) {
      console.error('파일 생성 실패:', error)
    }
  }, [containerId, getToken, isSignedIn])

  const addFolder = useCallback(async (parentId?: string) => {
    const name = prompt('폴더 이름을 입력하세요')
    if (!name) return

    if (!isSignedIn) {
      console.warn('로그인 후 폴더를 생성할 수 있습니다.')
      return
    }

    const token = await getToken({ template: 'jwt' })
    if (!token) {
      console.warn('Clerk 토큰이 없습니다 (폴더 생성 생략됨)')
      return
    }

    try {
      const created = await createFile({
        token,
        containerId,
        parentId,
        name,
        isFolder: true
      })
      setFiles(prev => insertNode(prev, parentId, created))
    } catch (error) {
      console.error('폴더 생성 실패:', error)
    }
  }, [containerId, getToken, isSignedIn])

  const deleteItem = useCallback(async (itemId: string) => {
    if (!isSignedIn) {
      console.warn('로그인 후 파일을 삭제할 수 있습니다.')
      return
    }

    const token = await getToken({ template: 'jwt' })
    if (!token) {
      console.warn('Clerk 토큰이 없습니다 (삭제 생략됨)')
      return
    }

    try {
      await removeFile({ token, fileId: itemId, containerId })
      setFiles(prev => removeNodeById(prev, itemId))
      if (activeId === itemId) setActiveId(undefined)
    } catch (error) {
      console.error('파일 삭제 실패:', error)
    }
  }, [activeId, containerId, getToken, isSignedIn])

  const renameItem = useCallback(async (itemId: string, newName: string) => {
    if (!newName.trim()) return

    if (!isSignedIn) {
      console.warn('로그인 후 이름을 변경할 수 있습니다.')
      return
    }

    const token = await getToken({ template: 'jwt' })
    if (!token) {
      console.warn('Clerk 토큰이 없습니다 (이름 변경 생략됨)')
      return
    }

    const parent = findParent(files, itemId)

    try {
      await moveFile({
        token,
        fileId: itemId,
        containerId,
        newParentId: parent?.id,
        newName
      })
      setFiles(prev => updateNodeNameInTree(prev, itemId, newName))
    } catch (error) {
      console.error('파일 이름 변경 실패:', error)
    }
  }, [containerId, files, getToken, isSignedIn])

  const saveFileContent = useCallback(async (content?: string) => {
    if (!activeId || !activeFile) return

    const contentToSave = content !== undefined ? content : activeFile.content
    const parent = findParent(files, activeId)
    const path = parent ? parent.name : ''
    const today = new Date().toISOString().split('T')[0]
    const totalMs = getTodayTotalTime()

    const payload = {
      containerId: containerId || 0,
      name: activeFile.name,
      path,
      content: contentToSave,
      codingTimeMs: totalMs,
      recordDate: today
    }

    console.group(`%c 📤 서버 전송 시도: ${activeFile.name}`, 'color: #ff9800; font-weight: bold;')
    console.log('전송 데이터:', payload)
    console.groupEnd()

    try {
      const res = await fetch(`${API_BASE_URL}/file/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        console.log('%c ✅ 서버 저장 완료', 'color: #2196f3; font-weight: bold;')
        setStats(prev => {
          const newDaily = [...prev.daily]
          const idx = newDaily.findIndex(d => d.todayDate === today)
          if (idx >= 0) newDaily[idx] = { ...newDaily[idx], codingTimeMs: totalMs }
          else newDaily.push({ todayDate: today, codingTimeMs: totalMs })
          return { ...prev, daily: newDaily }
        })
      } else {
        console.error('서버 저장 실패:', res.status)
      }
    } catch (error) {
      console.error('네트워크 에러:', error)
    }
  }, [activeFile, activeId, containerId, files, getTodayTotalTime])

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
      updateFileContent,
      stats,
      currentSessionMs,
      getTodayTotalTime,
      saveCodingSession,
      saveFileContent,
      setIsWorking,
      containerId
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
