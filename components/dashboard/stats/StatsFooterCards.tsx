import { Card, CardContent } from "@/components/ui/card";
import { formatDuration } from "@/components/dashboard/stats/timeUtils";

interface StatsFooterCardsProps {
  dailyAverageMs: number;
  longestDayMs: number;
  longestDayLabel?: string;
}

export default function StatsFooterCards({
  dailyAverageMs,
  longestDayMs,
  longestDayLabel,
}: StatsFooterCardsProps) {
  const averageLabel = formatDuration(dailyAverageMs);
  const longestTitle = longestDayLabel
    ? `Longest Day (${longestDayLabel})`
    : "Longest Day (This Week)";
  const longestLabel = formatDuration(longestDayMs);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="bg-bg-raised rounded border border-slate-300 dark:border-slate-700">
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">
            Daily Average (This Week)
          </p>
          <p className="text-2xl font-bold">{averageLabel}</p>
        </CardContent>
      </Card>

      <Card className="bg-bg-raised rounded border border-slate-300 dark:border-slate-700">
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">{longestTitle}</p>
          <p className="text-2xl font-bold">{longestLabel}</p>
        </CardContent>
      </Card>
    </div>
  );
}
