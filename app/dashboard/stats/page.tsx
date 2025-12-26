"use client";

import { useMemo } from "react";
import StatsSummaryCards from "@/components/dashboard/stats/StatsSummaryCards";
import CodingActivityChart from "@/components/dashboard/stats/CodingActivityChart";
import StatsFooterCards from "@/components/dashboard/stats/StatsFooterCards";
import {
  WebICContextProvider,
  useWebIC,
  type DailyStat,
} from "@/app/ide/contexts/WebICContext";

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

type ChartPoint = {
  label: string;
  valueMs: number;
  dateLabel: string;
};

const buildChartData = (dailyStats: DailyStat[] = []): ChartPoint[] => {
  const today = new Date();
  return Array.from({ length: 7 }).map((_, index) => {
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() - (6 - index));
    const isoDate = targetDate.toISOString().split("T")[0];
    const matchingStat = dailyStats.find((stat) => stat.todayDate === isoDate);
    return {
      label: WEEKDAY_LABELS[targetDate.getDay()],
      valueMs: matchingStat?.codingTimeMs ?? 0,
      dateLabel: isoDate
    };
  });
};

const StatsPageContent = () => {
  const { stats, currentSessionMs, getTodayTotalTime } = useWebIC();
  const chartData = useMemo(() => buildChartData(stats.daily), [stats.daily]);
  const weeklyTotalMs = stats.totalWeeklyCodingTime ?? 0;
  const todayTotalMs = getTodayTotalTime();
  const dailyAverageMs =
    chartData.length > 0
      ? chartData.reduce((sum, point) => sum + point.valueMs, 0) / chartData.length
      : 0;

  const longestPoint =
    chartData.length > 0
      ? chartData.reduce(
          (prev, point) => (point.valueMs > prev.valueMs ? point : prev),
          chartData[0]
        )
      : { label: "", valueMs: 0, dateLabel: "" };

  return (
    <div className="space-y-8 p-10">
      <h1 className="text-xl font-semibold">Coding Time Statistics</h1>

      <StatsSummaryCards
        currentSessionMs={currentSessionMs}
        todayTotalMs={todayTotalMs}
        weeklyTotalMs={weeklyTotalMs}
      />

      <CodingActivityChart data={chartData} />

      <StatsFooterCards
        dailyAverageMs={dailyAverageMs}
        longestDayMs={longestPoint.valueMs}
        longestDayLabel={longestPoint.label}
      />
    </div>
  );
};

export default function CodingTimeStatsPage() {
  return (
    <WebICContextProvider>
      <StatsPageContent />
    </WebICContextProvider>
  );
}
