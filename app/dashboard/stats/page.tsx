"use client";

import StatsSummaryCards from "@/components/dashboard/stats/StatsSummaryCards";
import CodingActivityChart from "@/components/dashboard/stats/CodingActivityChart";
import StatsFooterCards from "@/components/dashboard/stats/StatsFooterCards";

export default function CodingTimeStatsPage() {
  return (
    <div className="space-y-8 p-10">
      <h1 className="text-xl font-semibold">Coding Time Statistics</h1>

      <StatsSummaryCards />

      <CodingActivityChart />

      <StatsFooterCards />
    </div>
  );
}
