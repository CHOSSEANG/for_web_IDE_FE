// app/(auth)/sign-up/page.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { SignUp, useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";


export default function SignUpPage() {
  const [agreed, setAgreed] = useState(false);
  const [open, setOpen] = useState(false);

  const { signIn, isLoaded } = useSignUp();
  const router = useRouter();

  if (!isLoaded) return null;

  const socialLogin = (provider: "github" | "google" | "discord") => {
    signIn.authenticateWithRedirect({
      strategy: `oauth_${provider}`,
      redirectUrl: "/(auth)/callback",
      redirectUrlComplete: "/main",
    });
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="flex w-full mt-10 mb-10 flex-col items-center">
        <div className="flex flex-col items-center gap-6">
        <div className="w-full max-w-md bg-[#191e28] rounded-2xl p-8 shadow-lg">
        
          {/* Title */}
          <h1 className="text-center text-2xl font-semibold text-white mb-6">
            Create your WebIC account
          </h1>

          {/* Social Login */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <button onClick={() => socialLogin("github")}
                    className="flex items-center justify-center gap-2 rounded-lg bg-[#3A4152] py-2 text-sm text-white">
              GitHub</button>

            <button onClick={() => socialLogin("google")}
                    className="flex items-center justify-center gap-2 rounded-lg bg-[#3A4152] py-2 text-sm text-white">
              Google</button>

            <button onClick={() => socialLogin("discord")}
                    className="flex items-center justify-center gap-2 rounded-lg bg-[#3A4152] py-2 text-sm text-white">
              Discord</button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
            <div className="flex-1 h-px bg-gray-600/40" />
            <span>or create with email</span>
            <div className="flex-1 h-px bg-gray-600/40" />
          </div>

          {/* Form */}
          <form className="space-y-4">
             <div className="flex gap-4">
              <div className="flex-1">
              <label className="block text-sm text-gray-300 mb-1">
                User Name
              </label>
              <input
                type="text"
                placeholder="John"
                className="w-full rounded-lg bg-[#3A4152] px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              </div>
               
              </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-lg bg-[#3A4152] px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Password
              </label>
              <input
                  type="password"
                  placeholder=""
                className="w-full rounded-lg bg-[#3A4152] px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="mt-1 text-sm text-gray-400">
                  경고나 안내문구 노출 
                </p>
            </div>

            

            

            {/* Submit */}
            <button
              type="button"
              disabled={!agreed}
              className="w-full mt-4 rounded-lg bg-indigo-600 py-3 text-white font-medium
                        hover:bg-indigo-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              회원가입
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-gray-400">
            이미 회원이신가요?{" "}
            <Link href="/sign-in" className="text-indigo-400 hover:underline">
              Log in
            </Link>
          </p>
        </div>
        
        {/* Clerk 로그인 박스 */}
        <SignUp />
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>서비스 이용약관</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 text-sm text-text-muted">
            약관글자는 여기에 옵니다. 여긴 읽기만 하고, 밖에서 체크박스 해두기. 
              </div>
                
        </DialogContent>
      </Dialog>
    </main>

    
  );
}
