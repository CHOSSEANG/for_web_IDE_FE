// @/components/account/AccountModal.tsx
// 회원 프로필 모달창 (탭별, 탭의 모달별 별도 존재)

"use client";

// 회원 프로필 모달창 (탭별, 탭의 모달별 별도 존재)

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import AccountContent from "./AccountContent";

type AccountModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function AccountModal({
  open,
  onClose,
}: AccountModalProps) {
  /**
   * ✅ 탈퇴 완료 시 처리
   * - 계정관리 모달 닫기
   * - 이후 라우팅은 DeleteAccountModal에서 처리
   */
  const handleDeleted = () => {
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="
          w-full mx-2 top-4 -translate-y-0
          sm:mx-auto sm:max-w-[min(540px,65vw)] sm:top-1/2 sm:-translate-y-1/2
          max-h-[calc(100vh-1.5rem)] overflow-hidden
        "
      >
        {/* 접근성 필수 Title */}
        <DialogTitle>
          <VisuallyHidden>계정 관리</VisuallyHidden>
        </DialogTitle>

        {/* 접근성 경고 제거용 Description (UI 미노출) */}
        <DialogDescription>
          <VisuallyHidden>
            프로필 정보, 보안 설정, 소셜 로그인 연결을 관리할 수 있는 계정 설정 모달입니다.
          </VisuallyHidden>
        </DialogDescription>

        {/* 🔗 하위 컴포넌트에 탈퇴 완료 콜백 전달 */}
        <AccountContent
          onClose={onClose}
          onDeleted={handleDeleted}
        />
      </DialogContent>
    </Dialog>
  );
}
