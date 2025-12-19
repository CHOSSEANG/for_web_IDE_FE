// @/componenets/account/SecurityTab.tsx 
// 회원 프로필 모달창 보안탭

"use client"; 
import { useState } from "react";
import DeleteAccountModal from "@/components/modals/DeleteAccountModal";
import ChangePasswordModal from "@/components/modals/ChangePasswordModal";



export default function SecurityTab() {
  const [open, setOpen] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);

  const devices = [
    {
      type: "desktop",
      name: "MacBook · Chrome",
      lastActive: "2025.12.12",
      current: true,
      os: "macOS",
      environment: "Chrome 127",
      deviceType: "노트북",
    },
    {
      type: "mobile",
      name: "iPhone · Safari",
      lastActive: "2025.12.10",
      current: false,
      os: "iOS",
      environment: "Safari",
      deviceType: "모바일",
    },
  ];

  return (
    <>
      <section className="space-y-5">

        {/* 비밀번호 변경 */}
        <div className="rounded-3xl border  border-border-strong bg-bg-subtle/70 p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-base font-semibold text-text-primary mb-1">
                비밀번호
              </h2>
              <p className="text-xs text-text-muted leading-snug">
                주기적으로 비밀번호를 변경하세요.
              </p>
            </div>
            <button
              onClick={() => setPwOpen(true)}
              className="shrink-0 rounded-2xl border border-border-strong bg-bg-subtle px-4 py-2 
              text-sm font-semibold text-text-primary transition hover:border-blue-500
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60">
              비밀번호 변경
            </button>
          </div>
        </div>

        {/* 접속 기기 / 환경 정보 */}
        <div className="rounded-3xl  border border-border-strong bg-bg-subtle/70 p-5">
          <h2 className="text-base font-semibold text-text-primary mb-3">
            접속 기기 / 환경 정보
          </h2>
          <ul className="space-y-3">
            {devices.map((device, idx) => (
              <li
                key={idx}
                className="border-t pt-1.5 ml-2 border-border-strong bg-bg-raised text-sm text-text-primary"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{device.name}</span>
                  <span className="text-xs text-text-muted">
                    {device.lastActive}
                    {device.current && " · 현재 세션"}
                  </span>
                </div>
                <div className="text-xs text-text-muted ">
                  <div>
                    <p>
                    <span className="font-semibold text-text-primary text-[11px] uppercase tracking-wide mr-1">
                      OS : </span>
                      
                    <span className="text-[11px]">{device.os}</span></p>
                  </div>
                  
                </div>
              </li>
            ))}
          </ul>
        </div> 
        {/* 탈퇴하기 */}
        <div className="rounded-3xl border border-red-500/40 p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
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

      {/*모달은 section 밖 */}
      <DeleteAccountModal open={open} onClose={() => setOpen(false)} />
      <ChangePasswordModal open={pwOpen} onClose={() => setPwOpen(false)} />
    </>
  );
}
