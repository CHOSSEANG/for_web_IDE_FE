"use client";
import { SignUp } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <div>
          <h1>WebIC Sign Up</h1>
          <h2>Create your account</h2>
          <p>설명</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl">
          <div className="space-y-2">
            <Button variant="secondary">Secondary</Button>
          </div>
          <div className="space-y-2">
            <Button variant="secondary">Secondary</Button>
          </div>
          <div className="space-y-2">
            <Button variant="secondary">Secondary</Button>
          </div>
        </div>

      <SignUp />

      
        
      </div>
    </main>
  );
}
