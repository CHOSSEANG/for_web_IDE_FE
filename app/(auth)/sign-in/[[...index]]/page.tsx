// app/(auth)/sign-in/page.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { useSignIn, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

type SocialProvider = "github" | "google" | "discord";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function SignInPage() {
  const { signIn, isLoaded } = useSignIn();
  const { getToken } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [lastProvider, setLastProvider] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("lastAuthProvider");
  });

  if (!isLoaded) return null;

  /* -----------------------------
   * Social Login
   * ---------------------------- */
  const socialLogin = (provider: SocialProvider) => {
    localStorage.setItem("lastAuthProvider", provider);
    setLastProvider(provider);

    signIn.authenticateWithRedirect({
      strategy: `oauth_${provider}`, // ✅ 문자열 템플릿 수정
      redirectUrl: "/auth/callback",
      redirectUrlComplete: "/main",
    });
  };

  /* -----------------------------
   * Email / Password Login
   * ---------------------------- */
  const handleEmailLogin = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        // ✅ Clerk 토큰 획득
        const token = await getToken({ template: "jwt" });

        if (token && API_BASE_URL) {
          await fetch(`${API_BASE_URL}/user/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
        }

        router.push("/main");
      }
    } catch (err: unknown) {
      const status =
        typeof err === "object" && err !== null && "status" in err
          ? (err as { status?: number }).status
          : undefined;

      if (status === 429) {
        setErrorMessage("로그인 시도가 너무 잦습니다. 잠시 후 다시 시도해주세요.");
      } else {
        setErrorMessage("이메일 또는 비밀번호를 확인해주세요.");
      }

      console.error("Clerk sign-in error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[420px] px-4">
      <div className="space-y-6 rounded-3xl border border-border-strong bg-bg-raised/90 p-8 backdrop-blur">
        <h1 className="text-center text-2xl font-semibold text-text-primary">
          Welcome to WebIC
        </h1>
        <p className="text-center text-sm text-text-muted">
          로그인 후, WebIC을 사용할 수 있습니다
        </p>

        {/* Social Login */}
        <div className="grid grid-cols-3 gap-3">
          {(["github", "google", "discord"] as const).map((provider) => (
            <button
              key={provider}
              type="button"
              onClick={() => socialLogin(provider)}
              className="relative flex items-center justify-center rounded-2xl border border-border-strong bg-bg-subtle/60 px-3 py-2 text-sm font-semibold text-text-primary transition-colors hover:border-blue-500"
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

        <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
          <div className="flex-1 h-px bg-border-light" />
          <span>or login with email</span>
          <div className="flex-1 h-px bg-border-light" />
        </div>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleEmailLogin();
          }}
        >
          <div>
          <label className="text-xs font-semibold uppercase text-text-muted">
                Email
              </label>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-border-strong bg-bg-subtle px-4 py-3 text-sm text-text-primary"
            />
            </div>

          <div>
            <label className="text-xs font-semibold uppercase text-text-muted">
                Password
              </label>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-border-strong bg-bg-subtle px-4 py-3 text-sm text-text-primary"
            />
            </div>

          {errorMessage && (
            <p className="text-sm text-red-500">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white"
          >
            {isSubmitting ? "로그인 중..." : "Log In"}
          </button>
        </form>

        <p className="text-center text-sm text-text-muted">
          아직 회원이 아니신가요?{" "}
          <Link href="/sign-up" className="font-semibold text-blue-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
