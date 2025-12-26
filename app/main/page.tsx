// @/main/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs";


import NewContainer from "@/components/dashboard/NewContainer";
import ListContainer from "@/components/dashboard/ListContainer";
import { ContainerItem } from "@/types/container";
import { createContainer, fetchContainers } from "@/lib/api/container";
import { loginUser } from "@/lib/api/auth";
import type { TemplateWithIcon } from "@/components/dashboard/templateClient";

type ContainerCreatePayload = {
  template: TemplateWithIcon;
  name: string;
};

export default function DashboardMain() {
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();

  const hasCalledLoginApi = useRef(false);

  const clerkUserId = user?.id;
  const email = user?.primaryEmailAddress?.emailAddress;

  const [containers, setContainers] = useState<ContainerItem[]>([]);

  const handleCreateContainer = async ({ template, name }: ContainerCreatePayload) => {
    const normalizedName = name.trim();
    if (!normalizedName) {
      console.warn("create skip: 컨테이너 이름을 입력하세요");
      return;
    }

    if (containers.some((item) => item.name === normalizedName)) {
      window.alert("같은 이름의 컨테이너가 이미 존재합니다.");
      console.warn("duplicate container prevented:", normalizedName);
      return;
    }

    // getToken may return null if Clerk session expired/unauthorized; guard before API calls.
    const token = await getToken({ template: "jwt" });
    if (!token) {
      console.warn("Clerk token missing or expired (re-auth required) – API 호출 생략");
      return;
    }

    try {
      const createdContainer = await createContainer({
        token,
        name: normalizedName,
        templateId: template.id,
        templateName: template.name,
      });

      setContainers((prev) => [createdContainer, ...prev]);
    } catch (error) {
      console.error("컨테이너 생성 중 오류 발생:", error);
      window.alert("컨테이너 생성에 실패했습니다.");
      // TODO: API 실패 시 토스트/상태 표시로 사용자 알림
    }
  };

  useEffect(() => {
    if (!isSignedIn) return;

    // Authorization/credentials are injected via auth helpers; backend config handles CORS.
    // Verify NEXT_PUBLIC_API_BASE_URL per environment when deploying (dev vs prod).

    let isMounted = true;
    const loadContainers = async () => {
      // getToken may return null if Clerk session expired or token generation fails.
      const token = await getToken({ template: "jwt" });
      if (!token) {
        console.warn("Clerk token missing or expired; 컨테이너 목록 호출 생략");
        return;
      }

      try {
        const data = await fetchContainers({ token });
        if (isMounted) {
          setContainers(data);
        }
      } catch (error) {
        console.error("컨테이너 목록 로딩 실패 (GET /containers):", error);
        // TODO: retry/backoff toast를 여기서 연결하고, 현재는 빈 상태 유지
      }
    };

    loadContainers();

    return () => {
      isMounted = false;
    };
  }, [getToken, isSignedIn]);

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

        <NewContainer onCreate={handleCreateContainer} />
        <ListContainer containers={containers} />
      </main>
    </div>
  );
}
