"use client";

import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { UserRound, LogIn } from "lucide-react";
import { useAccountModal } from "@/components/account/useAccountModal";

export function UserToggle() {
  const { openModal } = useAccountModal(); // 훅은 최상위에서만 호출

  const handleOpen = () => {    // 임시로그 추가
    console.log("🔥 user icon clicked");
    openModal();
  };


  return (
    <div className="flex flex-col items-center justify-center">
      <SignedOut>
        <Link href="/sign-in">
          <LogIn className="w-6 h-6 cursor-pointer text-gray-400 hover:text-white transition-colors" />
        </Link>
      </SignedOut>

      <SignedIn>
        <button
          type="button"
          onClick={handleOpen}
          aria-label="내 정보 열기"
          className="p-0 bg-transparent border-none text-gray-400 hover:text-white transition-colors"
        >
          <UserRound className="w-6 h-6 cursor-pointer" />
        </button>
      </SignedIn>
    </div>
  );
}
