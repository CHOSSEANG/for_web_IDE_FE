// @/app/page.tsx
// 홈에서 로그인 / 비로그인 분기
// 배포이슈로 루트(/)에서 로그인 / 비로그인 분기 (middleware 없이) 
// 현재 파일명 middleware.off.ts 로 변경된 상태로 자동배포중
"use client";

// 홈에서 로그인 / 비로그인에 따라 이동
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  
  const { isLoaded, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    if (user) {
      router.replace("/main");
    } else {
      router.replace("/welcome");
    }
  }, [isLoaded, user, router]);

  return null;
}
