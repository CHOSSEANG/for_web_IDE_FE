"use client";

import StatsSummaryCards, { StatsAdditionalCards, CodingStatsData } from "@/components/dashboard/stats/StatsSummaryCards";
import CodingActivityChart from "@/components/dashboard/stats/CodingActivityChart";

// User provided mock data
const mockData: CodingStatsData = {
  daily: [
    { todayDate: "2025-12-15", codingTimeMs: 570000 },
    { todayDate: "2025-12-16", codingTimeMs: 0 },
    { todayDate: "2025-12-17", codingTimeMs: 291991 },
    { todayDate: "2025-12-18", codingTimeMs: 30000 },
    { todayDate: "2025-12-19", codingTimeMs: 0 },
    { todayDate: "2025-12-20", codingTimeMs: 0 },
    { todayDate: "2025-12-21", codingTimeMs: 0 },
  ],
  avgWeeklyCodingTime: 43531,
  maxWeeklyCodingTime: 570000,
  totalWeeklyCodingTime: 59392084,
};

export default function CodingTimeStatsPage() {
  return (
    <div className="space-y-8 p-10">
      <h1 className="text-xl font-semibold">Coding Time Statistics</h1>

      {/* Top 3 Cards */}
      <StatsSummaryCards data={mockData} />

      {/* Main Chart */}
      <CodingActivityChart />

      {/* Bottom 2 Cards */}
      <StatsAdditionalCards data={mockData} />
    </div>
  );
}
