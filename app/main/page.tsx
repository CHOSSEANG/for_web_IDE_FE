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

"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";

import NewContainer from "@/components/dashboard/NewContainer";
import ListContainer from "@/components/dashboard/ListContainer";

export default function DashboardMain() {
  const { isSignedIn, user } = useUser();

// 현재 백엔드 서버 머지 대기 상태일 수 있으므로
// fetch 실패 시에도 앱 동작은 유지되도록 처리
  const hasCalledLoginApi = useRef(false);

  useEffect(() => {
    if (!isSignedIn || !user) return;
    if (hasCalledLoginApi.current) return;

    hasCalledLoginApi.current = true;

    const loginToBackend = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              clerkUserId: user.id,
              email: user.primaryEmailAddress?.emailAddress ?? "",
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Backend login failed");
        }

        const data = await response.json();

        // 다음 단계에서 사용 예정
        console.log("backend login success:", data);
      } catch (error) {
        console.error("backend login error:", error);
      }
    };

    loginToBackend();
  }, [isSignedIn, user]);

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

