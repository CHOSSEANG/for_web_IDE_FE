export type ItemType = 'file' | 'folder'

export interface FileSystemItem {
    id: string
    name: string
    type: ItemType
    content?: string
    children?: FileSystemItem[]
    isOpen?: boolean
}
