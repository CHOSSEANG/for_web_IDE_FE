// @/main/page.tsx
"use client";

import { useEffect, useRef } from "react";
import { useUser, useAuth } from "@clerk/nextjs";

import NewContainer from "@/components/dashboard/NewContainer";
import ListContainer from "@/components/dashboard/ListContainer";

export default function DashboardMain() {
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();

  const hasCalledLoginApi = useRef(false);

  useEffect(() => {
    if (!isSignedIn || !user) return;
    if (hasCalledLoginApi.current) return;

    hasCalledLoginApi.current = true;

    const loginToBackend = async () => {
      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

        if (!apiBaseUrl) {
          console.warn(
            "NEXT_PUBLIC_API_BASE_URL is not set, skipping backend login"
          );
          return;
        }

        // ✅ Clerk JWT 발급
        const token = await getToken({ template: "jwt" });

        if (!token) {
          console.warn("Clerk JWT token not available");
          return;
        }

        const response = await fetch(`${apiBaseUrl}/user/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({
            clerkUserId: user.id,
            email: user.primaryEmailAddress?.emailAddress ?? "",
          }),
        });

        if (!response.ok) {
          throw new Error("Backend login failed");
        }

        const data = await response.json();

        if (typeof window !== "undefined" && data?.userId) {
          localStorage.setItem("webic_user_id", String(data.userId));
        }

        console.log("backend login success:", data);
      } catch (error) {
        console.error("backend login error:", error);
      }
    };

    loginToBackend();
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
