// @/app/(auth)/sign-in/page.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

type SocialProvider = "github" | "google" | "discord";

export default function SignInPage() {
  const { signIn, isLoaded } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [lastProvider, setLastProvider] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("lastAuthProvider");
  });

  if (!isLoaded) return null;

  /* =========================
   * 소셜 로그인
   * ========================= */
  const socialLogin = (provider: SocialProvider) => {
    localStorage.setItem("lastAuthProvider", provider);
    setLastProvider(provider);

    signIn.authenticateWithRedirect({
      strategy: `oauth_${provider}`, // ✅ 문자열 템플릿 수정
      redirectUrl: "/auth/callback",
      redirectUrlComplete: "/main",
    });
  };

  /* =========================
   * 이메일 + 비밀번호 로그인
   * ========================= */
  const handleEmailLogin = async () => {
  if (!signIn) return;

  try {
    // 1️⃣ 로그인 플로우 생성
    const signInResult = await signIn.create({
      identifier: email,
    });

    // 2️⃣ 비밀번호 검증 (이게 빠져 있었음)
    const attempt = await signIn.attemptFirstFactor({
      strategy: "password",
      password,
    });

    // 3️⃣ 완료 여부 확인
    if (attempt.status === "complete") {
      router.replace("/main");
      return;
    }

    console.error("Sign-in not completed:", attempt);
  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="w-full max-w-[420px] px-4">
      <div className="space-y-6 rounded-3xl border border-border-strong bg-bg-raised/90 p-8 backdrop-blur">

        {/* Title */}
        <h1 className="text-center text-2xl font-semibold text-text-primary">
          Welcome to WebIC
        </h1>

        {/* Social Login */}
        <div className="grid grid-cols-3 gap-3">
          {(["github", "google", "discord"] as const).map((provider) => (
            <button
              key={provider}
              onClick={() => socialLogin(provider)}
              className="relative flex items-center justify-center rounded-2xl border border-border-strong bg-bg-subtle/60 px-3 py-2 text-sm font-semibold text-text-primary transition-colors hover:border-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
            >
              {provider}

              {lastProvider === provider && (
                <span className="absolute -top-2 -right-2 rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                  계속하기
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
          <div className="flex-1 h-px bg-border-light" />
          <span>or login with email</span>
          <div className="flex-1 h-px bg-border-light" />
        </div>

        {/* Form */}
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleEmailLogin();
          }}
        >
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wide text-text-muted">
              Email
            </label>
            <input
              type="email"
              name="email"
              autoComplete="email"   // ✅ 유지
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-border-strong bg-bg-subtle px-4 py-3 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wide text-text-muted">
              Password
            </label>
            <input
              type="password"
              name="password"
              autoComplete="current-password" // ✅ 유지
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-border-strong bg-bg-subtle px-4 py-3 text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
          >
            Log In
          </button>
        </form>

        <p className="text-center text-sm text-text-muted">
          아직 회원이 아니신가요?{" "}
          <Link
            href="/sign-up"
            className="font-semibold text-blue-500 transition hover:text-blue-400"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
