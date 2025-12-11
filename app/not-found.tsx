"use client";

import Link from "next/link";
import ChristmasTree from "@/components/christmas/ChristmasTree";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-bg-base text-text-primary">
      
      {/* 아이콘 또는 간단한 ASCII 스타일 */}
      <div className="flex flex-col items-center mt-6">
      <ChristmasTree />

      <h1 className="text-4xl font-bold text-white mt-20">404 - Page Not Found</h1>
      <p className="text-gray-400 mt-2">The page you&apos;re looking for doesn&apos;t exist.</p>
    </div>
      
      
      <p className="text-text-muted max-w-md mb-8 text-sm">
        찾으려는 페이지가 사라졌거나 이동되었어요.  
        개발자가 커피 마시다가 폴더를 다른 데로 옮겼을 수도 있어요. ☕📁
      </p>

      {/* 액션 버튼 영역 */}
      <div className="flex gap-4">
        <Link
          href="/welcome"
          className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
        >
          WebIC 홈으로 이동
        </Link>

        <Link
          href="/ide"
          className="px-5 py-2 rounded-lg border border-border-light text-sm font-medium hover:bg-bg-raised transition"
        >
          작업하던 IDE로 돌아가기
        </Link>
      </div>

      {/* 하단 WebIC 브랜딩 */}
      <footer className="mt-12 text-xs text-text-muted opacity-60">
        © 2025 WebIC — Where Ideas Compile
      </footer>
    </main>
  );
}
