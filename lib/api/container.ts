import { authorizedFetch } from "./coding";
import type { Participant } from "@/app/ide/types/participant";
import type { ContainerItem } from "@/types/container";

const API_BASE_PATH = "/container";
const INVITES_PATH = "/container/invites";
const INVITE_ACTION_PATH = "/container/invite";

export async function getContainerUsers(params: {
  token: string;
  containerId: number;
}): Promise<Participant[]> {
  const { token, containerId } = params;
  return authorizedFetch<Participant[]>({
    token,
    path: `${API_BASE_PATH}/${containerId}/users`,
  });
}

export async function inviteUserToContainer(params: {
  token: string;
  containerId: number;
  target: string;
}): Promise<void> {
  const { token, containerId, target } = params;
  await authorizedFetch<void>({
    token,
    path: `${API_BASE_PATH}/${containerId}/invite`,
    init: {
      method: "POST",
      body: JSON.stringify({ target }),
    },
  });
}

export async function leaveContainer(params: {
  token: string;
  containerId: number;
}): Promise<void> {
  const { token, containerId } = params;
  await authorizedFetch<void>({
    token,
    path: `${API_BASE_PATH}/${containerId}/leave`,
    init: {
      method: "DELETE",
    },
  });
}

export interface ContainerInvite {
  inviteId: number;
  containerId: number;
  inviterName?: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED";
  message?: string;
  createdAt?: string;
}

export async function fetchContainerInvites(params: {
  token: string;
  containerId?: number;
}): Promise<ContainerInvite[]> {
  const { token, containerId } = params;
  const query = new URLSearchParams();
  if (containerId) {
    query.set("containerId", String(containerId));
  }
  const path =
    query.toString().length > 0
      ? `${INVITES_PATH}?${query.toString()}`
      : INVITES_PATH;

  return authorizedFetch<ContainerInvite[]>({
    token,
    path,
  });
}

export async function acceptInviteRequest(params: {
  token: string;
  inviteId: number;
}): Promise<void> {
  const { token, inviteId } = params;
  await authorizedFetch<void>({
    token,
    path: `${INVITE_ACTION_PATH}/${inviteId}/accept`,
    init: {
      method: "POST",
    },
  });
}

export async function declineInviteRequest(params: {
  token: string;
  inviteId: number;
}): Promise<void> {
  const { token, inviteId } = params;
  await authorizedFetch<void>({
    token,
    path: `${INVITE_ACTION_PATH}/${inviteId}/decline`,
    init: {
      method: "POST",
    },
  });
}

export async function fetchContainers(params: {
  token: string;
}): Promise<ContainerItem[]> {
  const { token } = params;
  return authorizedFetch<ContainerItem[]>({
    token,
    path: "/containers",
  });
}

export async function createContainer(params: {
  token: string;
  name: string;
  templateId: string;
  templateName: string;
}): Promise<ContainerItem> {
  const { token, name, templateId, templateName } = params;
  return authorizedFetch<ContainerItem>({
    token,
    path: "/containers",
    init: {
      method: "POST",
      body: JSON.stringify({
        name,
        templateId,
        templateName,
      }),
    },
  });
}
