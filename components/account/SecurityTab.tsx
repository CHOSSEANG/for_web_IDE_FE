// @/components/account/SecurityTab.tsx
// 회원 프로필 모달창 보안탭
// 서버 API에서 User-Agent 수집 필요 (접속 기기 정보 노출이 필요함) 현재 1개만 가능
// 비밀번호는 소셜 로그인시 변경할 수 없다는 경고창으로 대체

"use client";

import { useState, useMemo } from "react";
import { useSessionList, useUser } from "@clerk/nextjs";

import DeleteAccountModal from "@/components/modals/DeleteAccountModal";
import ChangePasswordModal from "@/components/modals/ChangePasswordModal";

/**
 * 🔒 접속 기기 노출 개수 제한
 * 추후 숫자만 바꾸면 됨
 */
const MAX_VISIBLE_DEVICES = 1;

export default function SecurityTab() {
  const [open, setOpen] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);

  const { sessions, isLoaded } = useSessionList();
  const { user, isLoaded: isUserLoaded } = useUser();

  /**
   * Clerk 세션 → 기존 UI에서 쓰던 device 형태로 변환
   * (UI 구조/스타일 변경 없음)
   */
  const devices = useMemo(() => {
    if (!isLoaded || !sessions) return [];

    return sessions.slice(0, MAX_VISIBLE_DEVICES).map((session, index) => ({
      name: `세션 ${index + 1}`,
      lastActive: session.lastActiveAt
        ? new Date(session.lastActiveAt)
            .toISOString()
            .slice(0, 10)
            .replaceAll("-", ".")
        : "-",
      current: session.status === "active",
      os: "-",
      environment: "-",
    }));
  }, [isLoaded, sessions]);

  const totalDeviceCount = sessions?.length ?? 0;

  /**
   * 🔐 비밀번호 변경 클릭 핸들러
   * - 소셜 로그인: 경고창만 노출
   * - 비밀번호 로그인: 모달 오픈
   */
  const handlePasswordClick = () => {
    if (!isUserLoaded) return;

    if (!user?.passwordEnabled) {
      alert("소셜 로그인 중으로 비밀번호를 변경할 수 없습니다");
      return;
    }

    setPwOpen(true);
  };

  return (
    <>
      <section className="space-y-5">
        {/* 비밀번호 변경 */}
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

        {/* 접속 기기 / 환경 정보 */}
        <div className="rounded-3xl border border-border-strong bg-bg-subtle/70 p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-text-primary">
              접속 기기 / 환경 정보
            </h2>
            <span className="text-xs text-text-muted">
              {Math.min(totalDeviceCount, MAX_VISIBLE_DEVICES)} /{" "}
              {totalDeviceCount}
            </span>
          </div>

          <ul className="space-y-3">
            {devices.map((device, idx) => (
              <li
                key={idx}
                className="border-t pt-2.5 ml-0 border-border-strong bg-bg-raised text-sm text-text-primary"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{device.name}</span>
                  <span className="text-xs text-text-muted">
                    {device.lastActive}
                    {device.current && " · 현재 세션"}
                  </span>
                </div>

                <div className="text-xs text-text-muted">
                  <p>
                    <span className="font-semibold text-text-primary text-[11px] uppercase tracking-wide mr-1">
                      OS :
                    </span>
                    <span className="text-[11px]">{device.os}</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* 탈퇴하기 */}
        <div className="rounded-3xl border border-red-500/40 p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-semibold text-red-300 mb-1">
                계정 탈퇴
              </h2>
              <p className="text-xs text-text-muted leading-snug">
                탈퇴시 모든 데이터가 영구적으로 삭제됩니다.
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
      <DeleteAccountModal open={open} onClose={() => setOpen(false)} />
      <ChangePasswordModal open={pwOpen} onClose={() => setPwOpen(false)} />
    </>
  );
}