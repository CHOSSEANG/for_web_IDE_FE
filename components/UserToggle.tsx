"use client";

import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { UserRound, LogIn } from "lucide-react";
import { useAccountModal } from "@/components/account/useAccountModal";
import { Button } from "@/components/ui/button";

export function UserToggle() {
  const { openModal } = useAccountModal(); // 훅은 최상위에서만 호출

  return (
    <div className="flex items-center gap-4">
      <SignedOut>
        <Link href="/sign-in">
          <LogIn className="w-6 h-6 cursor-pointer" />
        </Link>
      </SignedOut>

      <SignedIn>
        {/* 버튼이 눌리면 스토어 open 상태가 true로 설정되어 모달이 켜짐 */}
        <Button type="button" onClick={openModal} aria-label="내 정보 열기">
          <UserRound className="w-6 h-6 cursor-pointer" />
        </Button>
      </SignedIn>
    </div>
  );
}
