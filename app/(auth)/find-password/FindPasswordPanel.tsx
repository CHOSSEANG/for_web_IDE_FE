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
    <div className="relative w-full max-w-md rounded-3xl border border-border-strong bg-bg-raised/90 p-8 shadow-[0_25px_55px_rgba(1,3,10,0.65)] backdrop-blur">
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 text-text-muted transition hover:text-text-primary"
        aria-label="닫기"
      >
        ✕
      </button>

      {/* Title */}
      <h1 className="mb-6 text-center text-2xl font-semibold text-text-primary">
        계정 찾기
      </h1>

      {/* Tabs */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setMode("id")}
          className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 ${
            mode === "id"
              ? "border-blue-500 bg-blue-500/15 text-blue-200"
              : "border-border-strong bg-bg-subtle text-text-secondary hover:border-blue-500"
          }`}
        >
          아이디 찾기
        </button>

        <button
          type="button"
          onClick={() => setMode("password")}
          className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 ${
            mode === "password"
              ? "border-blue-500 bg-blue-500/15 text-blue-200"
              : "border-border-strong bg-bg-subtle text-text-secondary hover:border-blue-500"
          }`}
        >
          비밀번호 찾기
        </button>
      </div>

      {/* Description */}
      <p className="mb-6 text-center text-sm text-text-muted">
        이름과 전화번호를 입력해 주세요.
      </p>

      {/* Form */}
      <form className="space-y-4">
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wide text-text-muted">
            이름
          </label>
          <input
            type="text"
            placeholder="홍길동"
            className="w-full rounded-2xl border border-border-strong bg-bg-subtle px-4 py-3 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wide text-text-muted">
            전화번호
          </label>
          <input
            type="tel"
            placeholder="010-1234-5678"
            className="w-full rounded-2xl border border-border-strong bg-bg-subtle px-4 py-3 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
          />
        </div>

        {/* Submit */}
        <button
          type="button"
          className="mt-4 w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
        >
          메시지 보내기
        </button>
      </form>

      {/* Back */}
      <p className="mt-6 text-center text-sm text-text-muted">
        <button
          type="button"
          onClick={onClose}
          className="font-semibold text-blue-500 transition hover:text-blue-400"
        >
          ← 로그인 페이지로 돌아가기
        </button>
      </p>
    </div>
  );
}
