// @/main/page.tsx
"use client";

import { useEffect, useRef } from "react";
import { useUser, useAuth } from "@clerk/nextjs";


import NewContainer from "@/components/dashboard/NewContainer";
import ListContainer from "@/components/dashboard/ListContainer";
import { loginUser } from "@/lib/api/auth";

export default function DashboardMain() {
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();

  const hasCalledLoginApi = useRef(false);

  const clerkUserId = user?.id;
  const email = user?.primaryEmailAddress?.emailAddress;

  useEffect(() => {
    if (!isSignedIn || !clerkUserId || !email) return;
    if (hasCalledLoginApi.current) return;

    const loginToBackend = async () => {
      try {
        const token = await getToken({ template: "jwt" });
        if (!token) {
          console.warn("Clerk JWT token not available");
          return;
        }

        const data = await loginUser(token, {
          clerkUserId,
          email,
        });

        if (typeof window !== "undefined" && data?.userId) {
          localStorage.setItem("webic_user_id", String(data.userId));
        }

        hasCalledLoginApi.current = true;
        console.log("backend login success:", data);
      } catch (error) {
        console.error("backend login error:", error);
        // 실패 시 ref를 true로 만들지 않음 → 재시도 가능
      }
    };

    loginToBackend();
  }, [isSignedIn, clerkUserId, email, getToken]);

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
