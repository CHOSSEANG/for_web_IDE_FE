// app/(auth)/sign-in/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const { signIn, isLoaded } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [lastProvider, setLastProvider] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("lastAuthProvider");
    setLastProvider(stored);
  }, []);

  if (!isLoaded) return null;

  const socialLogin = (provider: "github" | "google" | "discord") => {
    localStorage.setItem("LastAuthProvider", Provider);
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
    <main className="min-h-screen flex items-center justify-center">
      <div className="flex w-full mt-10 mb-10 flex-col items-center">
        <div className="flex flex-col items-center gap-6">
      <div className="w-full max-w-md bg-[#191e28] rounded-2xl p-8 shadow-lg">

        {/* Title */}
        <h1 className="text-center text-2xl font-semibold text-white mb-6">
          Welcome to WebIC
        </h1>

        {/* Social Login */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {["github", "google", "discord"].map((p) => (
            <button
              key={p}
              onClick={() => socialLogin(p as any)}
              className="relative flex items-center justify-center rounded-lg bg-[#3A4152] py-2 text-sm text-white"
            >
              {p}
              {lastProvider === p && (
                <span className="absolute top-1 right-1 text-[10px] px-1.5 py-0.5 rounded bg-indigo-600">
                  최근 사용
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
            <label className="block text-sm text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
                  placeholder="you@example.com"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
              className="w-full rounded-lg bg-[#3A4152] px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
              </div>
              
              <div>
            <label className="block text-sm text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
                  placeholder="you@example.com"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
              className="w-full rounded-lg bg-[#3A4152] px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

        

              {/* Submit */}

          <button
                type="button"
                onClick={handleEmailLogin} 
            className="w-full mt-4 rounded-lg bg-indigo-700 py-3 text-white font-medium hover:bg-indigo-900 transition"
          >
            Log In
          </button>
        </form>



        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-400">
          아직 회원이 아니신가요?{" "}
          <Link href="/sign-up" className="text-indigo-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>

        </div>
      </div>

    </main>
  );
}