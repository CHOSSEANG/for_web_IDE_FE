// @/main/page.tsx
// web IDE Dashboard 

import {
  FiCode,
  FiPlay,
} from "react-icons/fi";
import {
  SiNodedotjs,
  SiReact,
  SiPython,
  SiDocker,
  SiPostgresql,
} from "react-icons/si";

import Pagination from "@/components/ui/Pagination";
import { Button } from "@/components/ui/button";

/**
 * Web IDE Dashboard - Main 영역 UI
 * - react-icons 적용
 * - IDE 대시보드 기준 다크/라이트 테마
 * - 전체 폭 + 반응형 grid
 * - lint / build 에러 방지 정리 완료
 */
export default function DashboardMain() {
  return (
    <div className="w-full flex flex-col">
      <main className="flex-1 px-3 py-4 sm:px-4 lg:px-6 flex-col items-center justify-center ">
        {/* ===== Title ===== */}
        <h1 className="text-lg font-semibold mb-1 text-center">WebIC Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 text-center">
          컨테이너를 생성하거나 최근 프로젝트를 선택하세요
        </p>

        {/* ================= Create New Container ================= */}
       <section className="mb-8">
  <div className="flex items-center justify-between mb-3">
    <h2 className="text-sm font-semibold">Create new container</h2>
    <button className="text-xs px-3 py-1.5 rounded-md bg-slate-200 dark:bg-slate-800">
      + New Template
    </button>
  </div>

  {/* Template Cards */}
  <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
    {[
      {
        name: "Node.js",
        desc: "Node.js development environment",
        icon: <SiNodedotjs className="text-green-500 text-lg" />,
      },
      {
        name: "React",
        desc: "React application template",
        icon: <SiReact className="text-sky-500 text-lg" />,
      },
      {
        name: "Python",
        desc: "Python development setup",
        icon: <SiPython className="text-yellow-400 text-lg" />,
      },
      {
        name: "Docker",
        desc: "Custom Docker container",
        icon: <SiDocker className="text-blue-500 text-lg" />,
      },
      {
        name: "Database",
        desc: "PostgreSQL + MySQL",
        icon: <SiPostgresql className="text-indigo-400 text-lg" />,
      },
      {
        name: "Full Stack",
        desc: "Complete web application",
        icon: <FiCode className="text-indigo-500 text-lg" />,
      },
    ].map((item, index) => (
      <div
        key={`${item.name}-${index}`}
        className="
          rounded-xl bg-slate-200/60 dark:bg-slate-800
          border border-slate-300 dark:border-slate-700
          p-3 sm:p-4
          flex items-center gap-2
          sm:flex-col sm:items-start
        "
      >
        {/* 아이콘 */}
        <div className="shrink-0">{item.icon}</div>

        {/* 텍스트 영역 */}
        <div>
          <p className="text-sm font-medium leading-tight">
            {item.name}
          </p>
          {/* 모바일에서는 숨김 */}
          <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400">
            {item.desc}
          </p>
        </div>
      </div>
    ))}
  </div>
</section>

        {/* ================= Recent Containers ================= */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">Recent Containers</h2>
            <Button className="text-xshover:underline text-xs px-3 py-1.5 " variant="secondary">
              View all
            </Button>
          </div>

          <div className="space-y-2">
            {[
              {
                name: "my-react-app",
                tech: "React",
                time: "2분 전",
                status: "running",
              },
              {
                name: "backend-api",
                tech: "Node.js",
                time: "1시간 전",
                status: "stopped",
              },
              {
                name: "python-ml-project-1",
                tech: "Python",
                time: "3시간 전",
                status: "stopped",
              },
              {
                name: "python-ml-project-2",
                tech: "Python",
                time: "5시간 전",
                status: "stopped",
              },
              {
                name: "python-ml-project-3",
                tech: "Python",
                time: "1일 전",
                status: "stopped",
              },
            ].map((item, index) => (
              <div
                key={`${item.name}-${index}`}   // ✅ key 안정화
                className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-slate-200/70 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
              >
                {/* Info */}
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {item.tech} · {item.time}
                  </p>
                </div>

                {/* Status + Action */}
                <div className="flex items-center gap-3">
                  {item.status === "running" ? (
                    <span className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-emerald-500/10 text-emerald-500">
                      <FiPlay className="text-xs" /> 실행 중
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-1 rounded bg-slate-400/10 text-slate-400">
                      중지됨
                    </span>
                  )}

                  <Button className="text-xs px-3 py-1.5 rounded-md transition">
                    {item.status === "running" ? "Open" : "Start"}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <Pagination currentPage={1} totalPages={99} />
        </section>
      </main>
    </div>
  );
}
