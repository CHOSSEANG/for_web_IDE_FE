import { authorizedFetch } from "./coding";
import { ChatMessage } from "@/app/ide/types/chat";

const API_PATH = "/chat";

export async function fetchChatHistory(params: {
  token: string;
  containerId: number;
  before?: string;
  limit?: number;
}): Promise<ChatMessage[]> {
  const { token, containerId, before, limit = 40 } = params;
  const query = new URLSearchParams({
    containerId: String(containerId),
    limit: String(limit),
  });
  if (before) {
    query.set("before", before);
  }
  return authorizedFetch<ChatMessage[]>({
    token,
    path: `${API_PATH}?${query.toString()}`,
  });
}

export async function searchChatMessages(params: {
  token: string;
  containerId: number;
  keyword: string;
}): Promise<ChatMessage[]> {
  const { token, containerId, keyword } = params;
  const query = new URLSearchParams({
    containerId: String(containerId),
    keyword,
  });
  return authorizedFetch<ChatMessage[]>({
    token,
    path: `${API_PATH}/search?${query.toString()}`,
  });
}
