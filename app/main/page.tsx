// @/main/page.tsx
// web IDE Dashboard 
"use client"

import NewContainer from "@/components/dashboard/NewContainer";
import ListContainer from "@/components/dashboard/ListContainer"

export default function DashboardMain() {
  return (
    <div className="w-full flex flex-col">
      <main className="px-3 py-4 sm:px-4 lg:px-6 flex-col items-center justify-center ">
        {/* ===== Title ===== */}
        <h1 className="text-lg font-semibold mb-1 text-center">WebIC Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 text-center">
          컨테이너를 생성하거나 최근 프로젝트를 선택하세요
        </p>

        <NewContainer />
        <ListContainer />
      </main>
    </div>
  );
}
