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
    (async () => {
      try {
        await handleRedirectCallback({
          afterSignInUrl: "/main",
          afterSignUpUrl: "/main",
        });
        router.replace("/main");
      } catch (error) {
        console.error("OAuth callback error:", error);
        router.replace("/welcome");
      }
    })();
  }, [handleRedirectCallback, router]);

  return (
    <div className="flex h-screen items-center justify-center text-sm text-text-muted">
      로그인 처리 중입니다…
    </div>
  );
}
