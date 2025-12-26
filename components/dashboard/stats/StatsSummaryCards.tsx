import { Card, CardContent } from "@/components/ui/card";

export default function StatsSummaryCards() {
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
                  <p className="font-semibold">0h 0m 33s</p>
                </div>
                <span className="text-xs text-emerald-500">Active</span>
              </li>

              <li className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm text-muted-foreground">Today’s Total</p>
                  <p className="font-semibold">2h 18m</p>
                </div>
                <span className="text-xs text-muted-foreground">Daily</span>
              </li>

              <li className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm text-muted-foreground">This Week</p>
                  <p className="font-semibold">30h 0m</p>
                </div>
                <span className="text-xs text-emerald-500">+12%</span>
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
            <p className="text-2xl font-bold">0h 0m 33s</p>
            <p className="text-xs text-emerald-500">Active now</p>
          </CardContent>
        </Card>

        <Card className="bg-bg-raised rounded border border-slate-300 dark:border-slate-700">
          <CardContent className="p-6 space-y-2">
            <p className="text-sm text-muted-foreground">Today’s Total</p>
            <p className="text-2xl font-bold">2h 18m</p>
            <p className="text-xs text-muted-foreground">Daily progress</p>
          </CardContent>
        </Card>

        <Card className="bg-bg-raised rounded border border-slate-300 dark:border-slate-700">
          <CardContent className="p-6 space-y-2">
            <p className="text-sm text-muted-foreground">This Week</p>
            <p className="text-2xl font-bold">30h 0m</p>
            <p className="text-xs text-emerald-500">+12% from last week</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
