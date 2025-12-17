import type { FileSystemItem } from '../types/fileTypes'

export const colors = {
    background: '#0d1117',
    surface: '#161b22',
    border: '#2d333b',
    textPrimary: '#e6edf3',
    textSecondary: '#8b949e',
    accent: '#3b82f6',
    accentMuted: 'rgba(59, 130, 246, 0.2)',
    highlight: '#1f6feb',
}

export const initialFiles: FileSystemItem[] = [
    {
        id: 'root-welcome',
        name: 'welcome.md',
        type: 'file',
        content: '# Welcome\n\nWebIC Editor Module\n\nStart creating files or folders!',
    },
    {
        id: 'src-folder',
        name: 'src',
        type: 'folder',
        isOpen: true,
        children: [
            {
                id: 'example-js',
                name: 'example.js',
                type: 'file',
                content: 'console.log("Hello WebIC!");'
            }
        ]
    }
]
