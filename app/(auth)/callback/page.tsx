// app/(auth)/callback/page.tsx
// (auth) 그룹 폴더이므로 실제 라우트는 `/callback`

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";

export default function AuthCallbackPage() {
  const { handleRedirectCallback } = useClerk();
  const router = useRouter();

  useEffect(() => {
    const runCallback = async () => {
      try {
        await handleRedirectCallback({
          afterSignInUrl: "/main",
          afterSignUpUrl: "/main",
        });

        // Clerk 내부 redirect가 실패하거나 적용되지 않는 경우를 대비한 fallback
        router.replace("/main");
      } catch (error) {
        console.error("OAuth callback error:", error);
        router.replace("/welcome");
      }
    };

    runCallback();
  }, [handleRedirectCallback, router]);

  return (
    <div className="flex h-screen items-center justify-center text-sm text-text-muted">
      로그인 처리 중입니다…
    </div>
  );
}
