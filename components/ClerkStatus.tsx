"use client";

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function ClerkStatus() {
  return (
    <div className="p-5 flex gap-4 items-center">
      <SignedOut>
        <p>🙅‍♀️ 지금 로그인 안 되어있어</p>
      </SignedOut>

      <SignedIn>
        <p>🙆‍♀️ 로그인 상태!</p>
        <UserButton afterSignOutUrl="/sign-in" />
      </SignedIn>
    </div>
  );
}
