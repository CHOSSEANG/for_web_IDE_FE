"use client"; // useState 사용하는 클라이언트 컴포넌트 표시
import { useState } from "react";
import DeleteAccountModal from "@/components/modals/DeleteAccountModal";
import ChangePasswordModal from "@/components/modals/ChangePasswordModal";
import TwoFactorModal from "@/components/modals/TwoFactorModal";



export default function SecurityTab() {
  const [open, setOpen] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);
  const [twoFaOpen, setTwoFaOpen] = useState(false);
  

  const devices = [
    {
      type: "desktop",
      name: "MacBook · Chrome",
      lastActive: "2025.12.12",
      current: true,
    },
    {
      type: "mobile",
      name: "iPhone · Safari",
      lastActive: "2025.12.10",
      current: false,
    },
  ];

  return (
    <>
      <section className="space-y-5">

        {/* 비밀번호 변경 */}
        <div className="rounded-3xl border border-border-strong bg-bg-subtle/70 p-5 shadow-[0_15px_40px_rgba(2,6,27,0.6)]">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-base font-semibold text-text-primary mb-1">
                비밀번호
              </h2>
              <p className="text-xs text-text-muted leading-snug">
                계정 보안을 위해 주기적으로 비밀번호를 변경하세요.
              </p>
            </div>
            <button
              onClick={() => setPwOpen(true)}
              className="shrink-0 rounded-2xl border border-border-strong bg-bg-raised px-4 py-2 text-sm font-semibold text-text-primary transition hover:border-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
            >
              비밀번호 변경
            </button>
          </div>
        </div>

        {/* 로그인된 기기 */}
        <div className="rounded-3xl border border-border-strong bg-bg-subtle/70 p-5 shadow-[0_15px_40px_rgba(2,6,27,0.6)]">
          <h2 className="text-base font-semibold text-text-primary mb-2">
            로그인된 기기
          </h2>
          <ul className="space-y-3">
            {devices.map((device, idx) => (
              <li
                key={idx}
                className="flex gap-3 rounded-2xl border border-border-strong bg-bg-raised px-3 py-2"
              >
                <span className="text-xl leading-none">
                  {device.type === "desktop" ? "🖥" : "📱"}
                </span>
                <div className="leading-snug">
                  <p className="text-sm font-semibold text-text-primary">
                    {device.name}
                  </p>
                  <p className="text-xs text-text-muted">
                    마지막 로그인: {device.lastActive}
                    {device.current && " · 현재 기기"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* 2단계 인증 */}
        <div className="rounded-3xl border border-border-strong bg-bg-subtle/70 p-5 shadow-[0_15px_40px_rgba(2,6,27,0.6)]">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-base font-semibold text-text-primary mb-1">
                2단계 인증
              </h2>
              <p className="text-xs text-text-muted leading-snug">
                로그인 시 추가 인증을 통해 계정 보안을 강화합니다.
              </p>
            </div>
            <button
              onClick={() => setTwoFaOpen(true)}
              className="shrink-0 rounded-2xl border border-border-strong bg-bg-raised px-4 py-2 text-sm font-semibold text-text-primary transition hover:border-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
            >
              2단계 인증 설정
            </button>
          </div>
        </div>

        {/* 탈퇴하기 */}
        <div className="rounded-3xl border border-red-500/40 bg-red-500/5 p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-base font-semibold text-red-300 mb-1">
                계정 탈퇴
              </h2>
              <p className="text-xs text-text-muted leading-snug">
                계정을 탈퇴하면 모든 데이터가 영구적으로 삭제됩니다.
              </p>
            </div>
            <button
              onClick={() => setOpen(true)}
              className="shrink-0 rounded-2xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/60"
            >
              탈퇴하기
            </button>
          </div>
        </div>

      </section>

      {/*모달은 section 밖 */}
      <DeleteAccountModal open={open} onClose={() => setOpen(false)} />
      <ChangePasswordModal open={pwOpen} onClose={() => setPwOpen(false)} />
      <TwoFactorModal open={twoFaOpen} onClose={() => setTwoFaOpen(false)} />
    </>
  );
}
