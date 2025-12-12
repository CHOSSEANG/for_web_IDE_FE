// app/(auth)/sign-in/page.tsx
import Link from "next/link";

export default function SignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0B1020] via-[#0E1325] to-[#0A0F1D]">
      <div className="w-full max-w-md bg-[#2A3142] rounded-2xl p-8 shadow-lg">

        {/* Title */}
        <h1 className="text-center text-2xl font-semibold text-white mb-6">
          Welcome back
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
              className="w-full rounded-lg bg-[#3A4152] px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-lg bg-[#3A4152] px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Remember me */}
          <div className="flex items-center text-sm text-gray-300">
            <input
              type="checkbox"
              id="remember"
              className="mr-2 accent-indigo-500"
            />
            <label htmlFor="remember">Remember me</label>
          </div>

          {/* Submit */}
          <button
            type="button"
            className="w-full mt-4 rounded-lg bg-indigo-500 py-3 text-white font-medium hover:bg-indigo-600 transition"
          >
            Log In
          </button>
        </form>

        {/* Find account */}
        <p className="mt-4 text-center text-sm">
          <Link href="/find-account" className="text-indigo-400 hover:underline">
            아이디 / 비밀번호 찾기
          </Link>
        </p>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="text-indigo-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
