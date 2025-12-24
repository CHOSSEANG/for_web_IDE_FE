// @/components/account/SecurityTab.tsx
// 회원 프로필 모달창 보안탭
// Clerk 세션 기준: 현재 로그인 세션의 로그인 시간만 표시
// 비밀번호는 소셜 로그인 시 변경 불가 (경고 처리)

"use client";

import { useState, useMemo } from "react";
import { useSessionList, useUser } from "@clerk/nextjs";

import DeleteAccountModal from "@/components/modals/DeleteAccountModal";
import ChangePasswordModal from "@/components/modals/ChangePasswordModal";

type SecurityTabProps = {
  onDeleted: () => void;
};

export default function SecurityTab({ onDeleted }: SecurityTabProps) {
  const [open, setOpen] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);

  const { sessions, isLoaded } = useSessionList();
  const { user, isLoaded: isUserLoaded } = useUser();

  /**
   * 현재 로그인 세션의 로그인 시간
   */
  const loginAt = useMemo(() => {
    if (!isLoaded || !sessions || sessions.length === 0) return "-";

    const currentSession =
      sessions.find((s) => s.status === "active") ?? sessions[0];

    return currentSession.createdAt
      ? new Date(currentSession.createdAt).toLocaleString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "-";
  }, [isLoaded, sessions]);

  /**
   * 비밀번호 변경
   */
  const handlePasswordClick = () => {
    if (!isUserLoaded || !user) return;

    if (!user.passwordEnabled) {
      alert("소셜 로그인 계정은 비밀번호를 변경할 수 없습니다.");
      return;
    }

    setPwOpen(true);
  };

  return (
    <>
      <section className="space-y-5">
        {/* 비밀번호 */}
        <div className="rounded-3xl border border-border-strong bg-bg-subtle/70 p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-semibold text-text-primary mb-1">
                비밀번호
              </h2>
              <p className="text-xs text-text-muted leading-snug">
                주기적으로 비밀번호를 변경하세요.
              </p>
            </div>
            <button
              onClick={handlePasswordClick}
              className="shrink-0 rounded-2xl border border-border-strong bg-bg-subtle px-4 py-2
              text-sm font-semibold text-text-primary transition hover:border-blue-500
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
            >
              비밀번호 변경
            </button>
          </div>
        </div>

        {/* 마지막 접속일 */}
        <div className="rounded-3xl border border-border-strong bg-bg-subtle/70 p-5">
          <h2 className="text-base font-semibold text-text-primary mb-2">
            마지막 접속일
          </h2>

          <div className="border-t pt-3 border-border-strong bg-bg-raised text-sm text-text-primary">
            <div className="flex items-center justify-between">
              <span className="font-semibold">현재 로그인</span>
              <span className="text-xs text-text-muted">
                {loginAt} · 현재 세션
              </span>
            </div>

            <p className="mt-1 text-xs text-text-muted">
              현재 로그인된 세션 기준으로 표시됩니다.
            </p>
          </div>
        </div>

        {/* 계정 탈퇴 */}
        <div className="rounded-3xl border border-red-500/40 p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-semibold text-red-300 mb-1">
                계정 탈퇴
              </h2>
              <p className="text-xs text-text-muted leading-snug">
                탈퇴 시 모든 데이터가 영구적으로 삭제됩니다.
              </p>
            </div>
            <button
              onClick={() => setOpen(true)}
              className="shrink-0 rounded-2xl bg-red-400 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-400
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/60"
            >
              탈퇴하기
            </button>
          </div>
        </div>
      </section>

      {/* 모달 */}
      <DeleteAccountModal
        open={open}
        onClose={() => setOpen(false)}
        onDeleted={onDeleted}
      />
      <ChangePasswordModal open={pwOpen} onClose={() => setPwOpen(false)} />
    </>
  );
}
