// app/(auth)/sign-up/page.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { SignUp } from "@clerk/nextjs";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";


export default function SignUpPage() {
  const [agreed, setAgreed] = useState(false);
  const [open, setOpen] = useState(false);

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
            <button className="flex items-center justify-center gap-2 rounded-lg bg-[#3A4152] py-2 text-sm text-white">
              GitHub
            </button>
            <button className="flex items-center justify-center gap-2 rounded-lg bg-[#3A4152] py-2 text-sm text-white">
              Naver
            </button>
            <button className="flex items-center justify-center gap-2 rounded-lg bg-[#3A4152] py-2 text-sm text-white">
              Kakao
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
            <div className="flex-1 h-px bg-gray-600/40" />
            <span>or create with email</span>
            <div className="flex-1 h-px bg-gray-600/40" />
          </div>

          {/* Form */}
          <form className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full rounded-lg bg-[#3A4152] px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
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
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Confirm Password
              </label>
              <input
                  type="password"
                  placeholder=""
                className="w-full rounded-lg bg-[#3A4152] px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Terms 약관동의 */}
            <div className="mt-4 text-sm text-text-muted">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 accent-primary"
                />
                <span>
                  동의 하시겠습니까?{" "}
                  <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="text-primary  text-indigo-600 hover:underline"
                  >
                    약관보기
                  </button>
                </span>
              </label>
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
