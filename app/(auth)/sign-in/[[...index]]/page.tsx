// app/(auth)/sign-in/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import type { ClerkAPIError } from "@clerk/types";

type SocialProvider = "github" | "google" | "discord";
// Define the social login union once so the handler stays strongly typed without redefinition.

export default function SignInPage() {
  const { signIn, isLoaded } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [lastProvider, setLastProvider] = useState<string | null>(() => {
    // eslint requires avoiding immediate setState in effects, so we read localStorage lazily here.
    if (typeof window === "undefined") return null;
    return localStorage.getItem("lastAuthProvider");
  });

  if (!isLoaded) return null;
    
  const socialLogin = (provider: SocialProvider) => {

    if (!provider) {
      console.error("Provider is missing");
      return;
    }
    localStorage.setItem("lastAuthProvider", provider);
    setLastProvider(provider);

    signIn.authenticateWithRedirect({
      strategy: `oauth_${provider}`,
      redirectUrl: "/auth/callback",
      redirectUrlComplete: "/main",
    });
  };

  const handleEmailLogin = async () => {
  try {
    await signIn.create({
      identifier: email,
      password,
    });

    router.push("/main");
  } catch (err) {
    console.error(err);
  }
  };
  
  
  return (
    
        <div className="w-full max-w-[360px] px-4">
          <div className="rounded-2xl bg-[#191e28] p-8 shadow-lg">

            {/* Title */}
            <h1 className="text-center text-2xl font-semibold text-white mb-6">
              Welcome to WebIC
            </h1>

            {/* Social Login */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {(["github", "google", "discord"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => socialLogin(p)}
                  className="relative flex items-center justify-center rounded-lg bg-[#3A4152] py-2 text-sm text-white"
                >
                  {p}
                  {lastProvider === p && (
                    <span className="absolute -top-2 -right-2 rounded-full bg-indigo-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                계속하기
              </span>
                  )}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
              <div className="flex-1 h-px bg-gray-600/40" />
              <span>or login with email</span>
              <div className="flex-1 h-px bg-gray-600/40" />
            </div>

            {/* Form */}
            <form className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Email</label>
                <input
                type="email"
                name="email"
                  placeholder="Email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg bg-[#3A4152] px-4 py-3 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg bg-[#3A4152] px-4 py-3 text-sm text-white"
                />
              </div>

              <button
                type="button"
                onClick={handleEmailLogin}
                className="w-full mt-4 rounded-lg bg-indigo-700 py-3 text-white font-medium"
              >
                Log In
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-400">
              아직 회원이 아니신가요?{" "}
              <Link href="/sign-up" className="text-indigo-400 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>

  );
}
