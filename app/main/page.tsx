// @/main/page.tsx
// web IDE Dashboard 

//
//localStorage에 저장 + util 함수로 접근 - 아래 주석 메모용
// /user/login 응답의 userId는 localStorage("webic_user_id")에 저장 예정


// 통계 API 매핑 설계 (가장 좋은 대기 작업) - UI 매핑 표
// | UI 영역           | API 값                    |
// | --------------- | ------------------------- |
// | Current Session | 프론트 실시간 타이머           |
// | Today’s Total   | daily[].codingTimeMs (오늘)|
// | This Week       | totalWeeklyCodingTime     |
// | Daily Average   | avgWeeklyCodingTime       |
// | Longest Day     | maxWeeklyCodingTime       |
// | Bar Chart       | daily[].codingTimeMs      |

// TEMP: backend login API integration (spec not finalized)
// TODO: refactor after API spec confirmation
// NOTE: backend login API not ready yet
// DO NOT IMPLEMENT until backend spec is finalized

// UX RULE:
// - backend login 실패 → toast만 표시
// - coding stats 실패 → 위젯 skeleton 유지
// - 치명적 에러 → empty state


// /app/main/page.tsx
// WebIC Dashboard – Clerk token + backend login integration

"use client";

import { useEffect, useRef } from "react";
import { useUser, useAuth } from "@clerk/nextjs";

import { loginUser } from "@/lib/api/auth";
import NewContainer from "@/components/dashboard/NewContainer";
import ListContainer from "@/components/dashboard/ListContainer";

export default function DashboardMain() {
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();

  // StrictMode / Fast Refresh 중복 호출 방지
  const hasCalledLoginApi = useRef(false);

  useEffect(() => {
    if (!isSignedIn || !user) return;
    if (hasCalledLoginApi.current) return;

    hasCalledLoginApi.current = true;

    const syncLogin = async () => {
      try {
        /**
         * 1️⃣ Clerk JWT 토큰 획득
         * - template 이름은 Clerk 콘솔에 생성한 JWT template 이름과 반드시 일치해야 함
         */
        const token = await getToken({
          template: "jwt", // ⚠️ 실제 JWT template 이름으로 교체
        });

        if (!token) {
          throw new Error("Authorization token is missing");
        }

        /**
         * 2️⃣ 백엔드 로그인 API 호출
         */
        const data = await loginUser(
          {
            clerkUserId: user.id,
            email: user.primaryEmailAddress?.emailAddress ?? "",
          },
          token
        );

        /**
         * 3️⃣ userId 로컬 저장 (후속 API에서 사용)
         */
        if (typeof window !== "undefined" && data?.userId) {
          localStorage.setItem("webic_user_id", String(data.userId));
        }

        console.log("✅ backend login success:", data);
      } catch (error) {
        console.error("❌ backend login error:", error);
      }
    };

    syncLogin();
  }, [isSignedIn, user, getToken]);

  return (
    <div className="w-full flex flex-col">
      <main className="px-3 py-4 sm:px-4 lg:px-6 flex-col items-center justify-center">
        <h1 className="text-lg font-semibold mb-1 text-center">
          WebIC Dashboard
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 text-center">
          컨테이너를 생성하거나 최근 프로젝트를 선택하세요
        </p>

        <NewContainer />
        <ListContainer />
      </main>
    </div>
  );
}