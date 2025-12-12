// app/(auth)/sign-up/page.tsx
import Link from "next/link";

export default function SignUpPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0B1020] via-[#0E1325] to-[#0A0F1D]">
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
    </main>
  );
}


// "use client";

// import { Button } from "@/components/ui/button";
// import { ThemeToggle } from "@/components/theme-toggle";
// //import { SignUp } from "@clerk/nextjs";

// export default function SignUpPage() {
//   return (
//     <div className="min-h-screen flex items-center justify-center ">
     
//       <div className="flex flex-col items-center justify-center w-full max-w-xs border-2 p-7 rounded-xl bg-raised shadow-xl">
//         <h1 className="text-2xl font-bold mb-4 text-center">
//           회원가입타이틀
//         </h1>
//         <p className="text-center">소셜 회원가입을 진행할 수 있습니다</p>

//       <div className="w-full mb-3 mt-3 grid grid-cols-2 md:grid-cols-3 gap-2 flex ">
//         <Button variant="secondary" className="flex-1 text-center p-2">구글</Button>
//         <Button variant="secondary" className="flex-1 text-center p-2">깃허브</Button>
//         <Button variant="secondary" className="flex-1 text-center p-2">카카오</Button>
//       </div>

//         구분선
//       <div className="w-full max-w-xs">
//         <p><span>아래 정보를 입력하고 회원가입을 완료하세요</span></p>
//       </div>

//       <form action="" className="w-full max-w-xs">
//         <div>
//           <label htmlFor=""> 이름</label>
//           <input type="text" placeholder="이름을 입력하세요" />
//         </div>

//         <div>
//           <label htmlFor=""> 전화번호</label>
//           <input placeholder="010" id="phone" name="phone"  type="tel"
//             inputMode="numeric" pattern="[0-9]{3}" maxLength={3} required  className="w-[2.3rem] pl-1"/>
//           -<input placeholder="1234" id="phone" name="phone"  type="tel"
//             inputMode="numeric" pattern="[0-9]{4}" maxLength={4} required  className="w-[3rem] pl-1"/>
//           -<input placeholder="5678" id="phone" name="phone"  type="tel"
//             inputMode="numeric" pattern="[0-9]{4}" maxLength={4} required  className="w-[3rem] pl-1"/>
//         </div>

//         <div>
//           <label htmlFor=""> 이메일</label>
//           <input type="email" placeholder="you@example.com" />
//         </div>

//         <div>
//           <label htmlFor=""> 비밀번호</label>
//           <input type="password" placeholder="비밀번호를 입력하세요" />
//         </div>

//         <div>
//           <label htmlFor=""> 비밀번호 확인</label>
//           <input type="password" placeholder="비밀번호를 한번더 입력하세요" />
//         </div>

//         <button >회원가입</button>
//       </form>

//       <div>
//         <p><a href="#">로그인</a> 화면으로 돌아가기</p>
//         </div>
        
//         </div>
//       {/* 클럭 회원가입 부분 
//       <SignUp
//         path="/sign-up"
//         routing="path"
//         redirectUrl="/"
//         afterSignUpUrl="/"
//       /> */}


//     </div>
//   );
// }
