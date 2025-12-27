// lib/api/container.ts

import { authorizedFetch } from "./coding";
import type { ContainerItem } from "@/types/container";

/**
 * Backend response contract – fields marked optional because the
 * service might omit them until the API stabilizes. The adapter
 * below normalizes missing values to keep the FE safe.
 */
type ContainerApiItem = {
  id: string;
  name: string;
  status?: "running" | "stopped";
  templateId?: string;
  templateName?: string;
  createdAt?: string;
};

type ContainerList ={
  data: ContainerApiItem[];
  error: string;
}

type CreateContainerParams = {
  token: string;
  name: string;
  templateId: string;
  templateName?: string;
};

type FetchContainersParams = {
  token: string;
};

function adaptToContainerItem(apiItem: ContainerApiItem): ContainerItem {
  const timeLabel = apiItem.createdAt
    ? new Date(apiItem.createdAt).toLocaleString("ko-KR")
    : "방금 전";

  return {
    id: Number(apiItem.id),
    name: apiItem.name,
    tech: apiItem.templateName ?? apiItem.templateId ?? "Unknown",
    time: timeLabel,
    status: apiItem.status ?? "stopped",
  };
}

export async function fetchContainers(params: FetchContainersParams): Promise<ContainerItem[]> {
  // authorizedFetch already sets Authorization and credentials; CORS headers
  // should be handled server-side (check dev/prod environment if issues surface).
  const data = await authorizedFetch<ContainerList>({
    token: params.token,
    path: "/container/list",
  });

  // null, undefined, 또는 배열이 아닌 경우 빈 배열 반환
  if (data.data == null) {
    console.warn("Unexpected response from /containers:", data);
    return [];
  }

  return data.data.map(adaptToContainerItem);
}

export async function createContainer(params: CreateContainerParams): Promise<ContainerItem> {
  const payload = {
    name: params.name,
    templateId: params.templateId,
  };

  // Authorization header + credentials ensured by authorizedFetch.
  const data = await authorizedFetch<ContainerApiItem>({
    token: params.token,
    path: "/containers",
    init: {
      method: "POST",
      body: JSON.stringify(payload),
    },
  });

  return adaptToContainerItem({
    ...data,
    templateName: params.templateName ?? data.templateName,
  });
}
