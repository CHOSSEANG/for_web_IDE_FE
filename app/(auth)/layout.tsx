// app/(auth)/layout.tsx
// 배포문제로 소스코드 바꿈. middleware.off.ts 사용시 소스자체 바꿔야함. 12/19 lilylee

"use client";

import type { ReactNode } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";



type AuthLayoutProps = {
  children: ReactNode;
  modal: ReactNode;
};

export default function AuthLayout({ children, modal }: AuthLayoutProps) {
  const { isLoaded, user } = useUser();
  const router = useRouter();

  // 로그인 사용자는 인증 페이지 접근 차단
  useEffect(() => {
    if (!isLoaded) return;

    if (user) {
      router.replace("/main");
    }
  }, [isLoaded, user, router]);

  // 로딩 중이거나 리다이렉트 직전에는 아무것도 렌더하지 않음
  if (!isLoaded || user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12">
        {children}
        {modal}
      </main>

      <Footer />
    </div>
  );
}
