import { Card, CardContent } from "@/components/ui/card";
import { formatDuration } from "@/components/dashboard/stats/timeUtils";

interface StatsSummaryCardsProps {
  currentSessionMs: number;
  todayTotalMs: number;
  weeklyTotalMs: number;
}

export default function StatsSummaryCards({
  currentSessionMs,
  todayTotalMs,
  weeklyTotalMs,
}: StatsSummaryCardsProps) {
  const sessionLabel = formatDuration(currentSessionMs);
  const todayLabel = formatDuration(todayTotalMs);
  const weeklyLabel = formatDuration(weeklyTotalMs);
  const isActive = currentSessionMs > 0;

  return (
    <>
      {/* ================= 모바일 전용 (리스트형) ================= */}
      <div className="md:hidden">
        <Card className="bg-bg-raised border border-slate-300 dark:border-slate-700">
          <CardContent className="p-4">
            <ul className="divide-y divide-slate-200 dark:divide-slate-700">
              <li className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm text-muted-foreground">Current Session</p>
                  <p className="font-semibold">{sessionLabel}</p>
                </div>
                <span
                  className={`text-xs ${
                    isActive ? "text-emerald-500" : "text-muted-foreground"
                  }`}
                >
                  {isActive ? "Active" : "Idle"}
                </span>
              </li>

              <li className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm text-muted-foreground">Today’s Total</p>
                  <p className="font-semibold">{todayLabel}</p>
                </div>
                <span className="text-xs text-muted-foreground">Daily</span>
              </li>

              <li className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm text-muted-foreground">This Week</p>
                  <p className="font-semibold">{weeklyLabel}</p>
                </div>
                <span className="text-xs text-emerald-500">Weekly</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* ================= 태블릿 · PC (기존 박스형) ================= */}
      <div className="hidden md:grid md:grid-cols-3 gap-4">
        <Card className="bg-bg-raised rounded border border-slate-300 dark:border-slate-700">
          <CardContent className="p-6 space-y-2">
            <p className="text-sm text-muted-foreground">Current Session</p>
            <p className="text-2xl font-bold">{sessionLabel}</p>
            <p className="text-xs text-emerald-500">
              {isActive ? "Active now" : "Idle"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-bg-raised rounded border border-slate-300 dark:border-slate-700">
          <CardContent className="p-6 space-y-2">
            <p className="text-sm text-muted-foreground">Today’s Total</p>
            <p className="text-2xl font-bold">{todayLabel}</p>
            <p className="text-xs text-muted-foreground">Daily progress</p>
          </CardContent>
        </Card>

        <Card className="bg-bg-raised rounded border border-slate-300 dark:border-slate-700">
          <CardContent className="p-6 space-y-2">
            <p className="text-sm text-muted-foreground">This Week</p>
            <p className="text-2xl font-bold">{weeklyLabel}</p>
            <p className="text-xs text-emerald-500">+12% from last week</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
