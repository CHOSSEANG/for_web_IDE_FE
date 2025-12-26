// lib/api/auth.ts

import { authorizedFetch } from "./coding";
import type { LoginResponse } from "./types";

export async function loginUser(
  token: string,
  payload: {
    clerkUserId: string;
    email: string;
  }
): Promise<LoginResponse> {
  return authorizedFetch<LoginResponse>(token, "/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}
