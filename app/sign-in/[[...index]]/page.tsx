"use client";
import { SignUp } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center justify-center">
      
        <div className="">
        <div>
          <h1>WebIC Sign Up</h1>
          <h2>Create your account</h2>
          <p>설명</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl">
          <div className="space-y-2">
            <Button variant="secondary">구글</Button>
          </div>
          <div className="space-y-2">
            <Button variant="secondary">깃허브</Button>
          </div>
          <div className="space-y-2">
            <Button variant="secondary">카카오</Button>
          </div>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-2 gap-6 max-w-3xl">
          <div className="space-y-2">
            <p><span>이름</span></p>
            <input type="text" placeholder="First name" className=""/>
          </div>
          <div className="space-y-2">
            <p><span>성</span></p>
            <input type="text" placeholder="Last name" className=""/>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 max-w-3xl">
          <div className="space-y-2">
            <p><span>Email address</span></p>
            <input type="text" placeholder="Enter your Email address" className="" />
            <p><input type="checkbox" name="" id="" /> <span>이메일 기억하기</span></p>
          </div>

          <div className="space-y-2">
            <p><span>Password</span></p>
            <input type="text" placeholder="Enter your Passworde" className=""/>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 max-w-3xl">
          <div className="space-y-2">
            회원가입 버튼
          </div>
          </div>
          
          <div>
            <div>
              <p>Already have an account? <a href="#">Sign in</a></p>
            </div>
          </div>
        </div>
      
        <SignUp />
      </div>
    </main>
  );
}