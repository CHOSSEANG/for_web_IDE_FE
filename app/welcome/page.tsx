"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserToggle } from "@/components/UserToggle";
import Logo from "@/components/brand/Logo";

export default function WelcomePage() {
  return (
    <main className="min-h-screen w-full flex flex-col">
     {/* ───────────────────────🔹 Top Header─────────────────────── */}
      <header className="w-full flex justify-between items-center py-6 px-8 border-b border-border-light">
        {/* 좌측: 회사 정보 */}
        <div className="flex gap-6 text-sm text-text-muted">
          <div className="flex items-center gap-2">
          <Logo variant="bar" className="w-15 h-5"/>
          </div>
          

          <Link href="/about" className="hover:text-text-primary transition">
            회사소개
          </Link>
          <Link href="/company" className="hover:text-text-primary transition">
            서비스 소개
          </Link>
          <Link href="/contact" className="hover:text-text-primary transition">
            문의하기
          </Link>
        </div>

        {/* 우측: 테마변경 */}
        <div className="fixed top-4 right-12">
                <UserToggle />
                <ThemeToggle />
              </div>
      </header>

      {/* ───────────────────────🔹 Content (Centered)─────────────────────── */}
      <div className="flex flex-col flex-1 items-center justify-center px-6 py-20 gap-20">
        <div className="flex items-center gap-2">
          <Logo variant="default" />
        </div>
        {/* Hero Section */}
        <section className="text-center max-w-2xl">
          <h1 className="text-4xl font-bold mb-4">Welcome to WebIC</h1>
          <p className="text-text-muted text-lg">
            브라우저에서 바로 개발하고 AI와 함께 더 빠르게 협업하는 Web IDE
          </p>
        </section>

        {/* Feature Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          <div className="p-6 rounded-lg bg-bg-raised border border-border-light">
            <h3 className="font-semibold mb-2">AI Assisted Coding</h3>
            <p className="text-sm text-text-muted">
              코드 자동완성, 분석, 리팩토링까지 지원
            </p>
          </div>

          <div className="p-6 rounded-lg bg-bg-raised border border-border-light">
            <h3 className="font-semibold mb-2">Real-time Collaboration</h3>
            <p className="text-sm text-text-muted">
              Liveblocks 기반 실시간 커서/편집/채팅
            </p>
          </div>

          <div className="p-6 rounded-lg bg-bg-raised border border-border-light">
            <h3 className="font-semibold mb-2">VSCode-Level Editor</h3>
            <p className="text-sm text-text-muted">
              Monaco Editor 기반 전문 개발 환경
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="flex gap-4">
          <Link
            href="/sign-in"
            className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium"
          >로그인</Link>

          <Link href="/sign-up"
            className="px-6 py-3 rounded-lg border border-border-light font-medium"
          >회원가입</Link>
        </section>
      </div>

      {/* ───────────────────────🔹 Footer─────────────────────── */}
      <footer className="w-full py-6 px-8 border-t border-border-light flex justify-between items-center text-sm text-text-muted">
        {/* 서비스 로고 */}
          <div className="flex items-center gap-2">
            <Logo variant="icon" className="w-6 h-6"/>
            <span>WebIC</span>
          </div>

        {/* 회사 정보 */}
        <div className="text-xs">
          © 2025 WebIC Inc. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
