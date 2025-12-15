// app/(auth)/reset-password/page.tsx
import Link from "next/link";

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0B1020] via-[#0E1325] to-[#0A0F1D]">
      <div className="w-full max-w-md bg-[#2A3142] rounded-2xl p-8 shadow-lg text-center">

        {/* Icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#3A4152]">
          {/* 아이콘은 임시 */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="h-8 w-8 text-indigo-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 7.5v9a2.25 2.25 0 0 1-2.25 2.25h-15A2.25 2.25 0 0 1 2.25 16.5v-9m19.5 0A2.25 2.25 0 0 0 19.5 5.25h-15A2.25 2.25 0 0 0 2.25 7.5m19.5 0-9.75 6.75L2.25 7.5"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-white mb-2">
          비밀번호 재설정
        </h1>

        {/* Description */}
        <p className="text-sm text-gray-400 mb-6 leading-relaxed">
          가입하신 이메일 주소를 입력해주세요.
          <br />
          인증 코드를 보내드립니다.
        </p>

        {/* Form */}
        <form className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1 text-left">
              이메일
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-lg bg-[#3A4152] px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Submit */}
          <button
            type="button"
            className="w-full mt-4 rounded-lg bg-indigo-500 py-3 text-white font-medium hover:bg-indigo-600 transition"
          >
            인증 코드 받기
          </button>
        </form>

        {/* Back */}
        <p className="mt-6 text-sm">
          <Link href="/sign-in" className="text-indigo-400 hover:underline">
            ← 로그인 페이지로 돌아가기
          </Link>
        </p>
      </div>
    </main>
  );
}
