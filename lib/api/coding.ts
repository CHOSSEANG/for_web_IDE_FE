// lib/api/coding.ts

import type { CodingStatsResponse } from "./types";

type FetchOptions = RequestInit & {
  headers?: HeadersInit;
};

/**
 * 런타임 기준으로 BASE_URL을 가져오기 위한 함수
 * (빌드 시점 고정 방지)
 */
function getBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!url) {
    if (typeof window !== 'undefined') {
      // 클라이언트 사이드 fallback (개발 환경용 - 운영 서버 연결)
      return 'https://api.webicapp.com';
    }
    return 'https://api.webicapp.com';
  }
  return url;
}

function normalizeHeaders(init?: FetchOptions): Headers {
  if (init?.headers instanceof Headers) {
    return new Headers(init.headers);
  }
  return new Headers(init?.headers ?? {});
}

/**
 * JWT 필수 인증 fetch
 */
export async function authorizedFetch<T>(
  params: {
    token: string;
    path: string;
    init?: FetchOptions;
  }
): Promise<T> {
  const { token, path, init } = params;

  const baseUrl = getBaseUrl();
  const headers = normalizeHeaders(init);

  // ✅ 필수 헤더
  headers.set("Authorization", `Bearer ${token}`);
  headers.set("Content-Type", "application/json");

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers,
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `API request failed: ${path} (${response.status}) ${text}`
    );
  }

  return response.json();
}

/**
 * 코딩 통계 조회
 */
export async function getCodingStats(
  params: {
    token: string;
  }
): Promise<CodingStatsResponse> {
  const { token } = params;

  return authorizedFetch<CodingStatsResponse>({
    token,
    path: "/code/coding-stats",
  });
}

/**
 * 코딩 세션 시작
 */
export async function startCodingSession(params: {
  token: string;
  userId: number;
}): Promise<{ codingId: number }> {
  const { token, userId } = params;

  return authorizedFetch<{ codingId: number }>({
    token,
    path: "/code",
    init: {
      method: "POST",
      body: JSON.stringify({ userId }),
    },
  });
}

/**
 * 코딩 세션 종료
 */
export async function endCodingSession(params: {
  token: string;
  codingId: number;
}): Promise<void> {
  const { token, codingId } = params;

  return authorizedFetch<void>({
    token,
    path: "/code",
    init: {
      method: "POST",
      body: JSON.stringify({ codingId }),
    },
  });
}

/**
 * 코딩 누적 시간 저장
 */
export async function saveCodingTime(params: {
  token: string;
  payload: {
    containerId: number;
    codingTimeMs: number;
    recordDate: string;
  };
}): Promise<void> {
  const { token, payload } = params;

  return authorizedFetch<void>({
    token,
    path: "/code",
    init: {
      method: "POST",
      body: JSON.stringify(payload),
    },
  });
}
