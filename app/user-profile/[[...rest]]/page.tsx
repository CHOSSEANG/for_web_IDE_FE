"use client";

import { UserProfile, SignedIn, SignOutButton } from "@clerk/nextjs";

export default function UserProfilePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <UserProfile />

      <SignedIn>
        <SignOutButton redirectUrl="/sign-in">
          <button className="px-4 py-2 bg-red-500 text-white rounded">
            로그아웃
          </button>
        </SignOutButton>
      </SignedIn>
    </div>
  );
}
