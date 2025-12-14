"use client";

import { useState } from "react";

type FindPasswordPanelProps = {
  onClose: () => void;
};

export default function FindPasswordPanel({
  onClose,
}: FindPasswordPanelProps) {
  const [mode, setMode] = useState<"id" | "password">("id");

  return (
    <div className="relative w-full max-w-md rounded-2xl bg-[#191e28] p-8 shadow-lg">
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 text-gray-400 hover:text-white"
        aria-label="닫기"
      >
        ✕
      </button>

      {/* Title */}
      <h1 className="mb-6 text-center text-2xl font-semibold text-white">
        계정 찾기
      </h1>

      {/* Tabs */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setMode("id")}
          className={`rounded-lg py-3 text-sm font-medium transition ${
            mode === "id"
              ? "bg-indigo-600 text-white"
              : "bg-[#3A4152] text-gray-300"
          }`}
        >
          아이디 찾기
        </button>

        <button
          type="button"
          onClick={() => setMode("password")}
          className={`rounded-lg py-3 text-sm font-medium transition ${
            mode === "password"
              ? "bg-indigo-600 text-white"
              : "bg-[#3A4152] text-gray-300"
          }`}
        >
          비밀번호 찾기
        </button>
      </div>

      {/* Description */}
      <p className="mb-6 text-center text-sm text-gray-400">
        이름과 전화번호를 입력해 주세요.
      </p>

      {/* Form */}
      <form className="space-y-4">
        <div>
          <label className="mb-1 block text-sm text-gray-300">이름</label>
          <input
            type="text"
            placeholder="홍길동"
            className="w-full rounded-lg bg-[#3A4152] px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-300">
            전화번호
          </label>
          <input
            type="tel"
            placeholder="010-1234-5678"
            className="w-full rounded-lg bg-[#3A4152] px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Submit */}
        <button
          type="button"
          className="mt-4 w-full rounded-lg bg-indigo-600 py-3 font-medium text-white transition hover:bg-indigo-900"
        >
          메시지 보내기
        </button>
      </form>

      {/* Back */}
      <p className="mt-6 text-center text-sm">
        <button
          type="button"
          onClick={onClose}
          className="text-indigo-400 hover:underline"
        >
          ← 로그인 페이지로 돌아가기
        </button>
      </p>
    </div>
  );
}
