// @/dashboard/page.tsx
// 메인으로 던져서 리다이렉트
// 그래프 페이지 /dashboard/stats

"use client"

import { redirect } from "next/navigation";

export default function DashboardPage() {
  redirect("/main");
}
