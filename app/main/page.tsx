"use client";

import { useEffect, useRef, useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs";

import NewContainer from "@/components/dashboard/NewContainer";
import ListContainer from "@/components/dashboard/ListContainer";

import type { ContainerItem } from "@/types/container";
import { fetchContainers } from "@/lib/api/container";
import { loginUser } from "@/lib/api/auth";

export default function DashboardMain() {
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();

  const hasCalledLoginApi = useRef(false);

  const clerkUserId = user?.id;
  const email = user?.primaryEmailAddress?.emailAddress;

  const [containers, setContainers] = useState<ContainerItem[]>([]);
  const [loading, setLoading] = useState(false);

  /* ===============================
   * 컨테이너 목록 로딩
   * =============================== */
  useEffect(() => {
    if (!isSignedIn) return;

    let mounted = true;

    const loadContainers = async () => {
      setLoading(true);

      const token = await getToken({ template: "jwt" });
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await fetchContainers({ token });
        if (mounted) {
          setContainers(data);
        }
      } catch (err) {
        console.error("컨테이너 목록 조회 실패:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadContainers();

    return () => {
      mounted = false;
    };
  }, [isSignedIn, getToken]);

  /* ===============================
   * 백엔드 로그인 (1회)
   * =============================== */
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
      } catch (err) {
        console.error("backend login error:", err);
      }
    };

    loginToBackend();
  }, [isSignedIn, clerkUserId, email, getToken]);

  /* ===============================
   * 컨테이너 이름 변경
   * =============================== */
  const handleRename = async (id: number, name: string) => {
    const token = await getToken({ template: "jwt" });
    if (!token) return;

    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/container/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });

    setContainers(prev =>
      prev.map(c => (c.id === id ? { ...c, name } : c))
    );
  };

  /* ===============================
   * 컨테이너 나가기
   * =============================== */
  const handleLeave = async (id: number) => {
    if (!confirm("해당 컨테이너를 나가시겠습니까?")) return;

    const token = await getToken({ template: "jwt" });
    if (!token) return;

    await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/container/${id}/leave`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setContainers(prev => prev.filter(c => c.id !== id));
  };

  /* ===============================
   * 컨테이너 삭제
   * =============================== */
  const handleDelete = async (id: number) => {
    if (!confirm("해당 컨테이너를 삭제하시겠습니까?")) return;

    const token = await getToken({ template: "jwt" });
    if (!token) return;

    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/container/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setContainers(prev => prev.filter(c => c.id !== id));
  };

  /* ===============================
   * RENDER
   * =============================== */
  return (
    <div className="w-full flex flex-col">
      <main className="px-3 py-4 sm:px-4 lg:px-6">
        <h1 className="text-lg font-semibold mb-1 text-center">
          WebIC Dashboard
        </h1>
        <p className="text-sm text-slate-500 mb-6 text-center">
          컨테이너를 생성하거나 최근 프로젝트를 선택하세요
        </p>

        {/* ✅ 생성 로직은 NewContainer 내부에서 처리 */}
        <NewContainer />

        {loading ? (
          <p className="text-sm text-center text-slate-400 mt-6">
            컨테이너를 불러오는 중입니다...
          </p>
        ) : (
          <ListContainer
            containers={containers}
            onRename={handleRename}
            onLeave={handleLeave}
            onDelete={handleDelete}
          />
        )}
      </main>
    </div>
  );
}
