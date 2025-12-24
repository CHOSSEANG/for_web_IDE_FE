// lib/api/auth.ts

import type { LoginResponse } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type LoginPayload = {
  clerkUserId: string;
  email: string;
};

export async function loginUser(
  payload: LoginPayload,
  token: string
): Promise<LoginResponse> {
  if (!BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
  }

  if (!token) {
    throw new Error("Authorization token is missing");
  }

  const response = await fetch(`${BASE_URL}/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`loginUser failed: ${response.status} ${text}`);
  }

  return response.json();
}
