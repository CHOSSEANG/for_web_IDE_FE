// lib/api/file.ts

import { authorizedFetch } from "./coding";
import type { FileSystemItem } from "@/app/ide/types/fileTypes";

type FileTreeApiItem = {
  id: string;
  name: string;
  type: "file" | "folder";
  children?: FileTreeApiItem[];
  content?: string;
  isOpen?: boolean;
};

type FileTreeApiResponse = FileTreeApiItem[] | { items?: FileTreeApiItem[] };

type FileContentApiResponse = {
  id: string;
  name: string;
  content?: string;
};

type CreateFileApiResponse = FileTreeApiItem | { item: FileTreeApiItem };

type MoveFileApiResponse = FileTreeApiItem | { item: FileTreeApiItem };

const adaptApiItem = (item: FileTreeApiItem): FileSystemItem => ({
  id: `${item.id}`,
  name: item.name,
  type: item.type,
  content: item.content,
  isOpen: item.type === "folder" ? item.isOpen ?? true : undefined,
  children: item.children?.map(adaptApiItem),
});

const extractItems = (payload: FileTreeApiResponse): FileTreeApiItem[] => {
  if (Array.isArray(payload)) {
    return payload;
  }
  return payload.items ?? [];
};

const cleanPayload = (payload: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined)
  );

export async function fetchFileTree(params: {
  token: string;
  containerId?: number;
}): Promise<FileSystemItem[]> {
  const query = params.containerId ? `?container_id=${params.containerId}` : "";
  const response = await authorizedFetch<FileTreeApiResponse>({
    token: params.token,
    path: `/file/tree${query}`,
  });

  return extractItems(response).map(adaptApiItem);
}

export async function fetchFileContent(params: {
  token: string;
  fileId: string;
}): Promise<{ name: string; content: string }> {
  const response = await authorizedFetch<FileContentApiResponse>({
    token: params.token,
    path: `/file/${params.fileId}/content`,
  });

  return {
    name: response.name,
    content: response.content ?? "",
  };
}

export async function createFile(params: {
  token: string;
  containerId?: number;
  parentId?: string;
  name: string;
  isFolder?: boolean;
}): Promise<FileSystemItem> {
  const payload = {
    container_id: params.containerId,
    parent_id: params.parentId,
    name: params.name,
    type: params.isFolder ? "folder" : "file",
  };

  const response = await authorizedFetch<CreateFileApiResponse>({
    token: params.token,
    path: "/file/create",
    init: {
      method: "POST",
      body: JSON.stringify(cleanPayload(payload)),
    },
  });

  const item = "item" in response ? response.item : response;
  return adaptApiItem(item);
}

export async function moveFile(params: {
  token: string;
  fileId: string;
  containerId?: number;
  newParentId?: string;
  newName?: string;
}): Promise<FileSystemItem> {
  const payload = {
    container_id: params.containerId,
    parent_id: params.newParentId,
    name: params.newName,
  };

  const response = await authorizedFetch<MoveFileApiResponse>({
    token: params.token,
    path: `/file/${params.fileId}/move`,
    init: {
      method: "POST",
      body: JSON.stringify(cleanPayload(payload)),
    },
  });

  const item = "item" in response ? response.item : response;
  return adaptApiItem(item);
}

export async function removeFile(params: {
  token: string;
  fileId: string;
  containerId?: number;
}): Promise<void> {
  const payload = {
    container_id: params.containerId,
  };

  await authorizedFetch<void>({
    token: params.token,
    path: `/file/${params.fileId}/remove`,
    init: {
      method: "DELETE",
      body: JSON.stringify(cleanPayload(payload)),
    },
  });
}
