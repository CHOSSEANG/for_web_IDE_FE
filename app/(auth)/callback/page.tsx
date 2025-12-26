// app/auth/callback/page.tsx
// import { RedirectToSignIn } from "@clerk/nextjs";

// export default function Page() {
//   return <RedirectToSignIn />;
// }
// 콜백 에러 404 이슈로 위 소스 사용안함 12/24 lilylee

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";

export default function AuthCallbackPage() {
  const { handleRedirectCallback } = useClerk();
  const router = useRouter();

  useEffect(() => {
    handleRedirectCallback({
      afterSignInUrl: "/main",
      afterSignUpUrl: "/main",
    }).catch(() => {
      router.replace("/welcome");
    });
  }, [handleRedirectCallback, router]);

  return (
    <div className="flex h-screen items-center justify-center text-sm text-text-muted">
      로그인 처리 중입니다…
    </div>
  );
}
