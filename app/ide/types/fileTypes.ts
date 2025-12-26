export type ItemType = 'file' | 'folder'

export interface FileSystemItem {
    id: string
    serverId?: number  // Server-side file ID for API calls
    name: string
    type: ItemType
    content?: string
    children?: FileSystemItem[]
    isOpen?: boolean
    path?: string  // Full path from server
    extension?: string  // File extension
    createdAt?: string
    updatedAt?: string
}
