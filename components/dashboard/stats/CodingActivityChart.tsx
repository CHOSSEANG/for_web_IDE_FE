// 대시보드 - 통계 그래프  

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDuration } from "@/components/dashboard/stats/timeUtils";

type ChartPoint = {
  label: string;
  valueMs: number;
  dateLabel: string;
};

interface CodingActivityChartProps {
  data: ChartPoint[];
}

export default function CodingActivityChart({ data }: CodingActivityChartProps) {
  const maxValue = data.length ? Math.max(...data.map((point) => point.valueMs)) : 0;

  return (
    <Card className="bg-bg-raised rounded border border-slate-300 dark:border-slate-700">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Coding Activity</h2>
          <div className="flex gap-2">
            <Button size="sm" className="px-3">
              Daily
            </Button>
            <Button size="sm" className="px-3" variant="ghost">
              Weekly
            </Button>
          </div>
        </div>

        {data.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-sm text-muted-foreground">
            No activity recorded yet.
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-3 h-48">
            {data.map((point, idx) => {
              const heightPercent = maxValue > 0 ? (point.valueMs / maxValue) * 100 : 0;

              return (
                <div key={`${point.dateLabel}-${idx}`} className="flex flex-col items-center h-full">
                  {/* 그래프 bar 영역 */}
                  <div className="relative w-full flex-1">
                    <div
                      className="
                          absolute bottom-0 left-1/2 -translate-x-1/2
                          w-full
                          max-w-[40px]
                          sm:max-w-[40px]
                          md:max-w-[80px]
                          lg:max-w-[120px]
                          min-h-[8px]
                          rounded-md
                          bg-blue-500 dark:bg-blue-400
                        "
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>

                  {/* 요일 */}
                  <span className="mt-2 text-xs text-muted-foreground">
                    {point.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Last 7 days</span>
          <span>Peak: {formatDuration(maxValue)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
