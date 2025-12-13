"use client";

import Link from "next/link";
import { useState } from "react";

export default function FindPasswordPanel() {
  const [mode, setMode] = useState<"id" | "password">("id");

  return (
    <div className="w-full max-w-md bg-[#2A3142] rounded-2xl p-8 shadow-lg">
      {/* Title */}
      <h1 className="text-center text-2xl font-semibold text-white mb-6">
        계정 찾기
      </h1>

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => setMode("id")}
          className={`rounded-lg py-3 text-sm font-medium transition ${
            mode === "id"
              ? "bg-indigo-500 text-white"
              : "bg-[#3A4152] text-gray-300"
          }`}
        >
          아이디 찾기
        </button>
        <button
          onClick={() => setMode("password")}
          className={`rounded-lg py-3 text-sm font-medium transition ${
            mode === "password"
              ? "bg-indigo-500 text-white"
              : "bg-[#3A4152] text-gray-300"
          }`}
        >
          비밀번호 찾기
        </button>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-400 mb-6 text-center">
        이름과 전화번호를 입력해 주세요.
      </p>

      {/* Form */}
      <form className="space-y-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1">이름</label>
          <input
            type="text"
            placeholder="홍길동"
            className="w-full rounded-lg bg-[#3A4152] px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">전화번호</label>
          <input
            type="tel"
            placeholder="010-1234-5678"
            className="w-full rounded-lg bg-[#3A4152] px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Submit */}
        <button
          type="button"
          className="w-full mt-4 rounded-lg bg-indigo-500 py-3 text-white font-medium hover:bg-indigo-600 transition"
        >
          메시지 보내기
        </button>
      </form>

      {/* Back */}
      <p className="mt-6 text-center text-sm">
        <Link href="/sign-in" className="text-indigo-400 hover:underline">
          ← 로그인 페이지로 돌아가기
        </Link>
      </p>
    </div>
  );
}
