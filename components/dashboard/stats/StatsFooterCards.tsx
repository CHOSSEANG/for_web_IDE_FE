import { Card, CardContent } from "@/components/ui/card";

export default function StatsFooterCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="bg-bg-raised rounded border border-slate-300 dark:border-slate-700">
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">
            Daily Average (This Week)
          </p>
          <p className="text-2xl font-bold">4h 17m</p>
        </CardContent>
      </Card>

      <Card className="bg-bg-raised rounded border border-slate-300 dark:border-slate-700">
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">
            Longest Day (This Week)
          </p>
          <p className="text-2xl font-bold">7h 12m</p>
        </CardContent>
      </Card>
    </div>
  );
}
