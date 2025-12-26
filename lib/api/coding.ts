// lib/api/coding.ts

import type { CodingStatsResponse } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getCodingStats(
  userId: string
): Promise<CodingStatsResponse> {
  if (!BASE_URL) {
    throw new Error("API BASE URL is not defined");
  }

  const response = await fetch(
    `${BASE_URL}/code/coding-stats/${userId}`
  );

  if (!response.ok) {
    throw new Error("getCodingStats failed");
  }

  return response.json();
}
