import { Card, CardContent } from "@/components/ui/card";
import { Activity, Clock, Calendar, Zap, Trophy } from "lucide-react";
import { useEffect, useState } from "react";

// ================= Types =================
export interface DailyStat {
  todayDate: string;
  codingTimeMs: number;
}

export interface CodingStatsData {
  daily: DailyStat[];
  avgWeeklyCodingTime: number;
  maxWeeklyCodingTime: number;
  totalWeeklyCodingTime: number;
}

interface StatsCardsProps {
  data: CodingStatsData;
}

// ================= Helpers =================
function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

function formatSessionTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${m}m ${s}s`;
}

function getTodayString(): string {
  // Returns YYYY-MM-DD for local time
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// ================= Components =================

/**
 * 상단 3개 카드 (Current Session, Today's Total, This Week)
 */
export default function StatsSummaryCards({ data }: StatsCardsProps) {
  const [sessionSeconds, setSessionSeconds] = useState(0);

  // Live Timer Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Today's Total Calculation
  const todayStr = getTodayString();
  const todayData = data?.daily?.find((d) => d.todayDate === todayStr);
  const todayTotalMs = todayData ? todayData.codingTimeMs : 0;

  // This Week Total
  const weeklyTotalMs = data?.totalWeeklyCodingTime || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* 1. Current Session */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex gap-3">
              <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Current Session</p>
                <p className="text-xs text-slate-400">Live Timer</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {formatSessionTime(sessionSeconds)}
            </h3>
            <div className="flex items-center gap-1 mt-1">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs font-medium text-emerald-500">Active now</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Today's Total */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex gap-3">
              <div className="p-2.5 bg-sky-100 dark:bg-sky-900/30 rounded-lg">
                <Clock className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Today's Total</p>
                <p className="text-xs text-slate-400">{todayStr}</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {formatDuration(todayTotalMs)}
            </h3>
            <p className="text-xs text-slate-500 mt-1">Daily progress</p>
          </div>
        </CardContent>
      </Card>

      {/* 3. This Week */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex gap-3">
              <div className="p-2.5 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">This Week</p>
                <p className="text-xs text-slate-400">7 days</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {formatDuration(weeklyTotalMs)}
            </h3>
            {/* Mocking the increase for now as per design */}
            <p className="text-xs font-medium text-emerald-500 mt-1">
              ↗ +12% from last week
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * 하단 2개 카드 (Daily Average, Longest Day)
 * 차트 아래에 배치됩니다.
 */
export function StatsAdditionalCards({ data }: StatsCardsProps) {
  const avgMs = data?.avgWeeklyCodingTime || 0;
  const maxMs = data?.maxWeeklyCodingTime || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {/* 4. Daily Average */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-2">
            {/* 아이콘이 필요하다면 추가 */}
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Daily Average (This Week)</p>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {formatDuration(avgMs)}
          </h3>
        </CardContent>
      </Card>

      {/* 5. Longest Day */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Longest Day (This Week)</p>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {formatDuration(maxMs)}
          </h3>
        </CardContent>
      </Card>
    </div>
  );
}
