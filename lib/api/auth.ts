// lib/api/auth.ts

import type { LoginResponse } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function loginUser(payload: {
  clerkUserId: string;
  email: string;
}): Promise<LoginResponse> {
  if (!BASE_URL) {
    throw new Error("API BASE URL is not defined");
  }

  const response = await fetch(`${BASE_URL}/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Authorization 필요 여부 → 백엔드 메모 후 결정
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("loginUser failed");
  }

  return response.json();
}
