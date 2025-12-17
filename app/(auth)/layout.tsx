import type { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "WebIC · 인증",
};

type AuthLayoutProps = {
  children: ReactNode;
  modal: ReactNode;
};

export default function AuthLayout({ children, modal }: AuthLayoutProps) {
  // ✅ 1. 서버에서 로그인 상태 확인
  const { userId } = auth();

  // ✅ 2. 이미 로그인 상태면 로그인 페이지 접근 차단
  if (userId) {
    redirect("/app/main"); // ← Web IDE 메인 경로
  }

  // ⬇️ 여기까지 내려왔다는 건 "비로그인 사용자"라는 뜻
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
