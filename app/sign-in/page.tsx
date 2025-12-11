"use client";

import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <SignIn
        path="/sign-in"
        routing="path"
        redirectUrl="/"
        afterSignInUrl="/"
      />
    </div>
  );
}
