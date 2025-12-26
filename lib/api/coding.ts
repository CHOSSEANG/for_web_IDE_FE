// lib/api/coding.ts

import type { CodingStatsResponse } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type FetchOptions = RequestInit | undefined;

function ensureHeaders(init?: FetchOptions) {
  if (init?.headers instanceof Headers) {
    return new Headers(init.headers);
  }
  return new Headers(init?.headers);
}

async function authorizedFetch<T>(
  token: string,
  path: string,
  init?: FetchOptions
): Promise<T> {
  if (!BASE_URL) {
    throw new Error("API BASE URL is not defined");
  }

  const headers = ensureHeaders(init);
  headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${BASE_URL}${path}`, {
    credentials: "include",
    ...init,
    headers,
  });

  if (!response.ok) {
    throw new Error(`Request to ${path} failed`);
  }

  return response.json();
}

export async function getCodingStats(
  token: string,
  userId: string
): Promise<CodingStatsResponse> {
  return authorizedFetch<CodingStatsResponse>(
    token,
    `/code/coding-stats/${userId}`
  );
}

export { authorizedFetch };
