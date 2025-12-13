"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useClerk, useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

type SocialStrategy = "oauth_google" | "oauth_github";

const socialProviders: { label: string; strategy: SocialStrategy }[] = [
  {
    label: "Google 계정으로 계속하기",
    strategy: "oauth_google",
  },
  {
    label: "GitHub 계정으로 계속하기",
    strategy: "oauth_github",
  },
];

export default function SignInCustomPage() {
  const router = useRouter();
  const clerk = useClerk();
  const { isLoaded, signIn, setActive } = useSignIn();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const signInUrl = clerk?.buildSignInUrl?.();
  const forgotPasswordUrl = signInUrl
    ? new URL(
        "forgot-password",
        signInUrl.endsWith("/") ? signInUrl : `${signInUrl}/`
      ).toString()
    : "/sign-in/forgot-password";

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0F1D]">
        <p className="text-sm text-white/70">잠시만 기다려 주세요…</p>
      </div>
    );
  }

  const getErrorMessage = (error: unknown) => {
    if (error && typeof error === "object") {
      const err = error as any;
      return (
        err?.errors?.[0]?.message ??
        err?.longMessage ??
        err?.message ??
        "로그인 중 오류가 발생했습니다."
      );
    }

    return "로그인 중 오류가 발생했습니다.";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!signIn) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const result = await signIn.create({
        identifier: email.trim(),
        password,
      });

      if (result.status === "complete" && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        router.push("/main");
      } else {
        setErrorMessage("추가 인증이 필요합니다. 다른 단계를 진행해 주세요.");
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialSignIn = async (strategy: SocialStrategy) => {
    setErrorMessage("");
    if (!signIn) return;

    const redirectUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/main`
        : "/main";

    try {
      await signIn.authenticateWithRedirect({
        strategy,
        redirectUrl,
      });
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1D] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[450px] rounded-[30px] border border-white/20 bg-gradient-to-b from-black/60 to-white/5 p-10 shadow-2xl shadow-black/60 backdrop-blur-xl">
        <p className="text-center text-sm font-semibold uppercase tracking-[0.3em] text-white/60">
          WebIC Authentication
        </p>
        <h1 className="mt-3 text-center text-3xl font-bold text-white">
          다시 만나서 반갑습니다
        </h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white/70"
            >
              이메일
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
              className="mt-2 w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-base text-white outline-none transition focus:border-transparent focus:ring-2 focus:ring-blue-500"
              placeholder="you@webic.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white/70"
            >
              비밀번호
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
              className="mt-2 w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-base text-white outline-none transition focus:border-transparent focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between text-sm text-white/70">
            <label className="inline-flex items-center gap-3">
              <Checkbox
                checked={remember}
                onCheckedChange={(value) => setRemember(Boolean(value))}
                className="border-white/30 bg-transparent"
                aria-label="remember me"
              />
              <span>Remember me</span>
            </label>
            <a
              href={forgotPasswordUrl}
              className="font-semibold text-white underline-offset-4 hover:text-blue-300"
            >
              아이디/비밀번호 찾기
            </a>
          </div>

          {errorMessage && (
            <p
              role="alert"
              className="rounded-xl border border-red-500/60 bg-red-500/10 px-4 py-2 text-sm text-red-200"
            >
              {errorMessage}
            </p>
          )}

          <Button
            type="submit"
            variant="ghost"
            className="w-full rounded-xl bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 px-4 py-3 text-lg font-semibold text-white shadow-lg shadow-blue-500/40 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSubmitting}
          >
            이메일로 로그인
          </Button>
        </form>

        <div className="mt-6">
          <div className="flex items-center gap-3">
            <span className="flex-1 border-t border-white/20" />
            <span className="text-xs uppercase tracking-[0.3em] text-white/40">
              or continue with
            </span>
            <span className="flex-1 border-t border-white/20" />
          </div>

          <div className="mt-4 space-y-3">
            {socialProviders.map((provider) => (
              <button
                key={provider.strategy}
                type="button"
                onClick={() => handleSocialSignIn(provider.strategy)}
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {provider.label}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-white/70">
          아직 WebIC 회원이 아니신가요?{" "}
          <a
            href="/sign-up"
            className="font-semibold text-white underline-offset-4 hover:text-blue-300"
          >
            회원가입하기
          </a>
        </p>
      </div>
    </div>
  );
}
