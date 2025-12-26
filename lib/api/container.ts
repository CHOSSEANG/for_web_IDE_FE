import { authorizedFetch } from "./coding";
import type { Participant } from "@/app/ide/types/participant";

const API_BASE_PATH = "/container";

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
