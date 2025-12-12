"use client";

import { SignUp } from "@clerk/nextjs";
export const metadata = { title: "WEBIC - <페이지명>" };
export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignUp
        path="/sign-up"
        routing="path"
        redirectUrl="/"
        afterSignUpUrl="/"
      />
    </div>
  );
}
