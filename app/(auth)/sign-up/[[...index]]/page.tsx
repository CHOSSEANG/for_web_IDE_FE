// app/(auth)/sign-up/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignUp, useSignIn } from "@clerk/nextjs";
import type { ClerkAPIError } from "@clerk/types";
import PasswordVisibilityToggle from "@/components/ui/password-visibility-toggle";
import EmailVerificationModal from "@/components/modals/EmailVerificationModal";

type SocialProvider = "github" | "google" | "discord";

const CLERK_SIGNUP_ERROR_MESSAGES: Record<string, string> = {
  form_identifier_exists: "이미 사용 중인 이메일입니다.",
  form_identifier_invalid: "이메일 형식이 올바르지 않습니다.",
  form_password_length: "비밀번호는 최소 8자 이상이어야 합니다.",
  form_password_complexity:
    "비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.",
  form_password_pwned: "보안에 취약한 비밀번호입니다.",
};

const PROVIDER_LABEL: Record<SocialProvider, string> = {
  github: "GitHub",
  google: "Google",
  discord: "Discord",
};

export default function SignUpPage() {
  const { signUp, isLoaded: signUpLoaded } = useSignUp();
  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastProvider, setLastProvider] = useState<SocialProvider | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("lastAuthProvider");
    if (stored === "github" || stored === "google" || stored === "discord") {
      setLastProvider(stored);
    }
  }, []);

  if (!signUpLoaded || !signInLoaded) return null;

  /* -----------------------------
   * Social Login
   * ---------------------------- */
  const socialLogin = (provider: SocialProvider) => {
    localStorage.setItem("lastAuthProvider", provider);
    signIn.authenticateWithRedirect({
      strategy: `oauth_${provider}`,
      redirectUrl: "/auth/callback",
      redirectUrlComplete: "/main",
    });
  };

  /* -----------------------------
   * Email Sign Up
   * ---------------------------- */
  const handleSignUp = async () => {
    if (isSubmitting || !signUp) return;

    // ✅ TS 안전 보장 (이 아래에서 signUp은 절대 undefined 아님)
    const activeSignUp = signUp;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await activeSignUp.create({
        emailAddress: email,
        password,
      });

      /**
       * 🚫 이메일 인증이 완료되지 않은 경우
       * → 모달만 띄우고 절대 redirect / callback / 다음 단계 없음
       */
      if (
        result.verifications.emailAddress &&
        result.verifications.emailAddress.status !== "verified"
      ) {
        await activeSignUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });

        setShowVerifyModal(true);
        setIsSubmitting(false);
        return;
      }

      /**
       * ❗ 여기 도달하면 안 됨
       * (이 플로우에서는 이메일 인증 없이 성공 상태가 존재하지 않음)
       */
      throw new Error("Unexpected sign-up state");
    } catch (err: unknown) {
      let message = "회원가입에 실패했습니다. 다시 시도해주세요.";

      if (typeof err === "object" && err !== null && "errors" in err) {
        const clerkError = (err as { errors?: ClerkAPIError[] }).errors?.[0];
        if (clerkError?.code) {
          message =
            CLERK_SIGNUP_ERROR_MESSAGES[clerkError.code] ?? message;
        }
      }

      setErrorMessage(message);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="w-full max-w-[420px] px-4">
        <div className="space-y-6 rounded-3xl border border-border-strong bg-bg-raised/90 p-8 backdrop-blur">
          <h1 className="text-center text-2xl font-semibold text-text-primary">
            Create your WebIC
          </h1>

          {/* Social */}
          <div className="grid grid-cols-3 gap-3">
            {(["github", "google", "discord"] as const).map((provider) => (
              <button
                key={provider}
                type="button"
                onClick={() => socialLogin(provider)}
                className="relative flex items-center justify-center rounded-2xl border border-border-strong bg-bg-subtle/60 px-3 py-2 text-sm font-semibold text-text-primary hover:border-blue-500"
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

          {/* Form */}
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSignUp();
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
              {errorMessage && (
                <p className="text-sm text-red-500">{errorMessage}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold uppercase text-text-muted">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-border-strong bg-bg-subtle px-4 py-3 text-sm text-text-primary"
                />
                <PasswordVisibilityToggle
                  visible={showPassword}
                  onToggle={() => setShowPassword((v) => !v)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-blue-600 py-3 text-white disabled:opacity-60"
            >
              {isSubmitting ? "가입 처리 중..." : "회원가입"}
            </button>
          </form>

          {/* CAPTCHA mount */}
          <div id="clerk-captcha" className="mt-1" />

          <p className="text-center text-sm text-text-muted">
            이미 회원이신가요?{" "}
            <Link href="/sign-in" className="font-semibold text-blue-500">
              Log in
            </Link>
          </p>
        </div>
      </div>

      {signUp && (
        <EmailVerificationModal
          open={showVerifyModal}
          signUp={signUp}
          email={email}
          onClose={() => setShowVerifyModal(false)}
          onSuccess={() => {
            // ✅ 세션 활성화는 모달에서 끝났고, 여기서는 이동만
            router.push("/main");
          }}
        />
      )}
    </>
  );
}
