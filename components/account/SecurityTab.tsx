import { useState } from "react";
import DeleteAccountModal from "@/components/modals/DeleteAccountModal";

export default function SecurityTab() {
  const [open, setOpen] = useState(false);

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
      <section className="space-y-4">

        {/* 비밀번호 변경 */}
        <div className="bg-[#2A3142] rounded-2xl p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold mb-1">비밀번호</h2>
              <p className="text-xs text-gray-400 leading-snug">
                계정 보안을 위해 주기적으로 비밀번호를 변경하세요.
              </p>
            </div>
            <button className="shrink-0 rounded-lg bg-indigo-500 px-4 py-2 text-sm hover:bg-indigo-600 whitespace-normal break-keep">
              비밀번호 변경
            </button>
          </div>
        </div>

        {/* 로그인된 기기 */}
        <div className="bg-[#2A3142] rounded-2xl p-4">
          <h2 className="text-base font-semibold mb-2">로그인된 기기</h2>
          <ul className="space-y-2">
            {devices.map((device, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="text-xl leading-none">
                  {device.type === "desktop" ? "🖥" : "📱"}
                </span>
                <div className="leading-snug">
                  <p className="text-sm">{device.name}</p>
                  <p className="text-xs text-gray-400">
                    마지막 로그인: {device.lastActive}
                    {device.current && " · 현재 기기"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* 2단계 인증 */}
        <div className="bg-[#2A3142] rounded-2xl p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold mb-1">2단계 인증</h2>
              <p className="text-xs text-gray-400 leading-snug">
                로그인 시 추가 인증을 통해 계정 보안을 강화합니다.
              </p>
            </div>
            <button className="shrink-0 rounded-lg bg-indigo-500 px-4 py-2 text-sm hover:bg-indigo-600 whitespace-normal break-keep">
              2단계 인증 설정
            </button>
          </div>
        </div>

        {/* 탈퇴하기 */}
        <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-red-400 mb-1">
                계정 탈퇴
              </h2>
              <p className="text-xs text-gray-400 leading-snug">
                계정을 탈퇴하면 모든 데이터가 영구적으로 삭제됩니다.
              </p>
            </div>
            <button
              onClick={() => setOpen(true)}
              className="shrink-0 rounded-lg bg-red-500 px-4 py-2 text-sm hover:bg-red-600">
              탈퇴하기
            </button>
          </div>
        </div>

      </section>

      {/* 🔴 모달은 section 밖 */}
      <DeleteAccountModal open={open} onClose={() => setOpen(false)}
      />
    </>
  );
}
