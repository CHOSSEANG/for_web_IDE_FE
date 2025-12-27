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
  lang: string;
  status?: "running" | "stopped";
  templateId?: string;
  templateName?: string;
  createdAt?: string;
};

type ContainerList ={
  data:{
    containers: ContainerApiItem[];
    currentPage:number,
    first: boolean,
    hasNext: boolean,
    hasPrevious: boolean,
    last: boolean,
    totalElements: number,
    totalPages: number
  },
  error: string;
}

type ContainerResult = {
  data: ContainerItem[];
  error?: string | null;
  paging:{
    currentPage:number,
    first: boolean,
    hasNext: boolean,
    hasPrevious: boolean,
    last: boolean,
    totalElements: number,
    totalPages: number
  }
}

type CreateContainerParams = {
  token: string;
  name: string;
  templateId: string;
  templateName?: string;
};

type FetchContainersParams = {
  token: string;
  page?: number;
  size?: number;
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

export async function fetchContainers(params: FetchContainersParams): Promise<ContainerResult> {

  const queryParams = new URLSearchParams();
  if (params.page !== undefined) queryParams.append("page", params.page.toString());
  if (params.size !== undefined) queryParams.append("size", params.size.toString());

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";

  // authorizedFetch already sets Authorization and credentials; CORS headers
  // should be handled server-side (check dev/prod environment if issues surface).
  const data = await authorizedFetch<ContainerList>({
    token: params.token,
    path: `/container/list${queryString}`,
  });

  console.log(data);

  const containers = data?.data?.containers ?? [];

  return {
    data: containers.map(adaptToContainerItem),
    error: data.error ?? null,
    paging: {
      currentPage: data?.data?.currentPage ?? 0,
      first: data?.data?.first ?? true,
      hasNext: data?.data?.hasNext ?? false,
      hasPrevious: data?.data?.hasPrevious ?? false,
      last: data?.data?.last ?? true,
      totalElements: data?.data?.totalElements ?? 0,
      totalPages: data?.data?.totalPages ?? 0,
    }
  };
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
