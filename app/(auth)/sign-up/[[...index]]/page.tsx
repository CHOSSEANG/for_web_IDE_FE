// app/(auth)/sign-up/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignUp, useSignIn } from "@clerk/nextjs";
import type { ClerkAPIError } from "@clerk/types";
import PasswordVisibilityToggle from "@/components/ui/password-visibility-toggle";

type SocialProvider = "github" | "google" | "discord";

/** Clerk 에러 코드 → 한글 메시지 */
const CLERK_SIGNUP_ERROR_MESSAGES: Record<string, string> = {
  form_identifier_exists: "이미 사용 중인 이메일입니다.",
  form_identifier_invalid: "이메일 형식이 올바르지 않습니다.",
  form_password_length: "비밀번호는 최소 8자 이상이어야 합니다.",
  form_password_complexity:
    "비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.",
  form_password_pwned: "보안에 취약한 비밀번호입니다.",
};

/** UI 표시용 이름 매핑 */
const PROVIDER_LABEL: Record<SocialProvider, string> = {
  github: "GitHub",
  google: "Google",
  discord: "Discord",
};

export default function SignUpPage() {
  /** ───────────── hooks (순서 고정) ───────────── */
  const { signUp, isLoaded: signUpLoaded } = useSignUp();
  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastProvider, setLastProvider] =
    useState<SocialProvider | null>(null);

  /** ───────────── 최근 사용 소셜 불러오기 ───────────── */
  useEffect(() => {
    const stored = localStorage.getItem("lastAuthProvider");
    if (
      stored === "github" ||
      stored === "google" ||
      stored === "discord"
    ) {
      queueMicrotask(() => setLastProvider(stored));
    }
  }, []);

  if (!signUpLoaded || !signInLoaded) return null;

  /** ───────────── OAuth ───────────── */
  const socialLogin = (provider: SocialProvider) => {
    localStorage.setItem("lastAuthProvider", provider);

    signIn.authenticateWithRedirect({
      strategy: `oauth_${provider}`,
      redirectUrl: "/auth/callback",
      redirectUrlComplete: "/main",
    });
  };

  /** ───────────── 이메일 회원가입 ───────────── */
  const handleSignUp = async () => {
    if (!signUp) return;

    try {
      setErrorMessage(null);

      await signUp.create({
        emailAddress: email,
        password,
      });

      router.push("/main");
    } catch (err: unknown) {
      let message = "회원가입에 실패했습니다. 다시 시도해주세요.";

      if (
        typeof err === "object" &&
        err !== null &&
        "errors" in err
      ) {
        const clerkError = (err as { errors: ClerkAPIError[] }).errors?.[0];
        if (clerkError?.code) {
          message =
            CLERK_SIGNUP_ERROR_MESSAGES[clerkError.code] ?? message;
        }
      }

      setErrorMessage(message);
    }
  };

  /** ───────────── UI ───────────── */
  return (
    <div className="w-full max-w-[420px] px-4">
      <div className="space-y-6 rounded-3xl border border-border-strong bg-bg-raised/90 p-8 backdrop-blur">
        <h1 className="text-center text-2xl font-semibold text-text-primary">
          Create your WebIC
        </h1>

        {/* OAuth */}
        <div className="grid grid-cols-3 gap-3">
          {(["github", "google", "discord"] as const).map((provider) => (
            <button
              key={provider}
              onClick={() => socialLogin(provider)}
              className="relative flex items-center justify-center rounded-2xl border border-border-strong bg-bg-subtle/60 px-3 py-2 text-sm font-semibold text-text-primary transition-colors hover:border-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
            >
              {PROVIDER_LABEL[provider]}

              {lastProvider === provider && (
                <span className="absolute -top-2 -right-2 rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                  계속하기
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.25em] text-text-muted">
          <div className="flex-1 h-px bg-border-light" />
          <span>or create with email</span>
          <div className="flex-1 h-px bg-border-light" />
        </div>

        {/* Email / Password */}
        <form className="space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wide text-text-muted">
              Email
            </label>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-border-strong bg-bg-subtle px-4 py-3 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
            />
            {errorMessage && (
              <p className="text-sm font-medium text-error">{errorMessage}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wide text-text-muted">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-border-strong bg-bg-subtle px-4 py-3 pr-12 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
              />
              <PasswordVisibilityToggle
                visible={showPassword}
                onToggle={() => setShowPassword((v) => !v)}
              />
            </div>
            <p className="text-xs text-text-muted">
              * 최소 8자 이상, 영문(대문자 1개 이상)/숫자/특수문자 포함
            </p>
          </div>

          <button
            type="button"
            onClick={handleSignUp}
            className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
          >
            회원가입
          </button>
        </form>

        {/* Clerk CAPTCHA mount */}
        <div id="clerk-captcha" className="mt-1" />

        <p className="text-center text-sm text-text-muted">
          이미 회원이신가요?{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-blue-500 transition hover:text-blue-400"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
