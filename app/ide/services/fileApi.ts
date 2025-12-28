// File API Service Layer
// API 문서: http://api.webicapp.com/swagger-ui/index.html

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.webicapp.com";

// ===== Type Definitions =====

export interface ApiResponse<T> {
    data: T;
    error?: {
        code: string;
        message: string;
    };
}

// File Create
export interface FileCreateRequest {
    containerId: number;
    name: string;
    parentId?: number | null;
    content?: string;
}

export interface FileCreateResponse {
    id: number;
    containerId: number;
    fileName: string;
    parentDirectoryId: number | null;
    isDirectory: boolean;
    filePath: string;
    createdAt: string;
    updatedAt: string;
    fileExtension: string;
    description: string;
}

// File Update
export interface FileUpdateRequest {
    newName?: string;
    newContent?: string;
}

export interface FileUpdateResponse {
    fileId: number;
    fileName: string;
    parentId: number;
    isDirectory: boolean;
    filePath: string;
    createdAt: string;
    updatedAt: string;
    fileExtension: string;
    content: string;
    description: string;
}

// File Move
export interface FileMoveRequest {
    targetParentId: number | null;
}

export interface FileMoveResponse {
    fileId: number;
    fileName: string;
    newParentId: number;
    newPath: string;
    isDirectory: boolean;
    updatedAt: string;
    description: string;
}

// File Remove
export interface FileRemoveResponse {
    fileId: number;
    fileName: string;
    filePath: string;
    description: string;
}

// File Content Load
export interface FileLoadResponse {
    fileId: number;
    fileName: string;
    filePath: string;
    content: string;
    extension: string;
    updatedAt: string;
    description: string;
}

// File Tree
export interface FileTreeResponse {
    id: number;
    name: string;
    path: string;
    isDirectory: boolean;
    extension: string;
    createdAt: string;
    updatedAt: string;
    children?: FileTreeResponse[];
}

// ===== API Functions =====

/**
 * 전용 헤더 생성 헬퍼
 */
const getHeaders = (token?: string) => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

/**
 * 파일 또는 폴더 생성
 * POST /file/create
 */
export async function createFile(
    request: FileCreateRequest,
    token?: string
): Promise<ApiResponse<FileCreateResponse>> {
    const response = await fetch(`${API_BASE_URL}/file/create`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        throw new Error(`Failed to create file: ${response.statusText}`);
    }

    return response.json();
}

/**
 * 파일 수정 (이름 또는 내용)
 * PATCH /file/{fileId}/update
 */
export async function updateFile(
    fileId: number,
    request: FileUpdateRequest,
    token?: string
): Promise<ApiResponse<FileUpdateResponse>> {
    const response = await fetch(`${API_BASE_URL}/file/${fileId}/update`, {
        method: 'PATCH',
        headers: getHeaders(token),
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        throw new Error(`Failed to update file: ${response.statusText}`);
    }

    return response.json();
}

/**
 * 파일/폴더 이동
 * PATCH /file/{fileId}/move
 */
export async function moveFile(
    fileId: number,
    request: FileMoveRequest,
    token?: string
): Promise<ApiResponse<FileMoveResponse>> {
    const response = await fetch(`${API_BASE_URL}/file/${fileId}/move`, {
        method: 'PATCH',
        headers: getHeaders(token),
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        throw new Error(`Failed to move file: ${response.statusText}`);
    }

    return response.json();
}

/**
 * 파일/폴더 삭제
 * DELETE /file/{fileId}/remove?containerId={containerId}
 */
export async function removeFile(
    fileId: number,
    containerId: number,
    token?: string
): Promise<ApiResponse<FileRemoveResponse>> {
    const response = await fetch(
        `${API_BASE_URL}/file/${fileId}/remove?containerId=${containerId}`,
        {
            method: 'DELETE',
            headers: getHeaders(token),
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to remove file: ${response.statusText}`);
    }

    return response.json();
}

/**
 * 파일 내용 조회
 * GET /file/{fileId}/content
 */
export async function getFileContent(
    fileId: number,
    token?: string
): Promise<ApiResponse<FileLoadResponse>> {
    const response = await fetch(`${API_BASE_URL}/file/${fileId}/content`, {
        method: 'GET',
        headers: getHeaders(token),
    });

    if (!response.ok) {
        throw new Error(`Failed to get file content: ${response.statusText}`);
    }

    return response.json();
}

/**
 * 파일 트리 조회
 * GET /file/tree?containerId={containerId}
 */
export async function getFileTree(
    containerId: number,
    token?: string
): Promise<ApiResponse<FileTreeResponse[]>> {
    const response = await fetch(
        `${API_BASE_URL}/file/tree?containerId=${containerId}`,
        {
            method: 'GET',
            headers: getHeaders(token),
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to get file tree: ${response.statusText}`);
    }

    return response.json();
}
