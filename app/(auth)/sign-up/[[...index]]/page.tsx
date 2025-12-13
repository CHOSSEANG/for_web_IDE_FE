// app/(auth)/sign-up/page.tsx
import Link from "next/link";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0B1020] via-[#0E1325] to-[#0A0F1D]">
      <div className="flex w-full mt-10 mb-10 flex-col items-center justify-center bg-gradient-to-br from-[#0B1020] via-[#0E1325] to-[#0A0F1D]">
        <div className="flex flex-col items-center gap-6">
        <div className="w-full max-w-md bg-[#2A3142] rounded-2xl p-8 shadow-lg">
        
          {/* Title */}
          <h1 className="text-center text-2xl font-semibold text-white mb-6">
            Create your Web IDE account
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
                className="w-full rounded-lg bg-[#3A4152] px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full rounded-lg bg-[#3A4152] px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Terms */}
            <p className="text-sm text-gray-400 mt-2">
              I agree to the{" "}
              <a href="#" className="text-indigo-400 hover:underline">
                Terms of Service
              </a>
            </p>

            {/* Submit */}
            <button
              type="button"
              className="w-full mt-4 rounded-lg bg-indigo-500 py-3 text-white font-medium hover:bg-indigo-600 transition"
            >
              Create Account
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-indigo-400 hover:underline">
              Log in
            </Link>
          </p>
        </div>
        
        {/* Clerk 로그인 박스 */}
        <SignUp />
        </div>
      </div>
    </main>
  );
}
