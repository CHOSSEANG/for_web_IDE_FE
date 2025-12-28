"use client";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useTheme } from "@/app/providers/theme-provider";
import { Card, CardContent, CardHeader, CardTitle } from "./StatsCard";
import type { DailyStat } from "./StatsSummaryCards";

interface CodingActivityChartProps {
    data?: DailyStat[];
}

// 시간(ms) -> h m s 포맷 유틸리티
function formatDurationPrecise(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    const parts = [];
    if (h > 0) parts.push(`${h}h`);
    if (m > 0 || h > 0) parts.push(`${m}m`);
    parts.push(`${s}s`);

    return parts.join(' ');
}

export default function CodingActivityChart({ data = [] }: CodingActivityChartProps) {
    const { theme } = useTheme();

    // Theme-aware colors for Recharts
    const colors = {
        grid: theme === 'dark' ? '#1D2633' : '#D6DEE6',
        tick: theme === 'dark' ? '#A8B2C1' : '#4A5562',
        cursor: theme === 'dark' ? '#111623' : '#EDF1F7',
        bar: theme === 'dark' ? '#3368A9' : '#4A89C7',
        tooltipBg: theme === 'dark' ? '#161D2C' : '#E4E8EF', // bg-raised
        tooltipBorder: theme === 'dark' ? '#1D2633' : '#D6DEE6', // border-light
    };
    // 요일 포맷 (YYYY-MM-DD -> MM/DD or Day Name)
    const formattedData = data.map(item => ({
        ...item,
        // YYYY-MM-DD 형식에서 월/일만 추출하거나 요일로 변환
        shortDate: item.todayDate.split('-').slice(1).join('/'),
        // 시간(ms)을 시간(hour) 단위로 변환 (소수점 1자리)
        hours: parseFloat((item.codingTimeMs / (1000 * 60 * 60)).toFixed(1)),
        // 툴팁용 정밀 포맷
        preciseTime: formatDurationPrecise(item.codingTimeMs)
    }));

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Coding Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                        <BarChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.grid} />
                            <XAxis
                                dataKey="shortDate"
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 12, fill: colors.tick }}
                                dy={10}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 12, fill: colors.tick }}
                                tickFormatter={(value: number) => `${value}h`}
                            />
                            <Tooltip
                                cursor={{ fill: colors.cursor }}
                                content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div
                                                className="p-3 border rounded-lg shadow-lg"
                                                style={{
                                                    backgroundColor: colors.tooltipBg,
                                                    borderColor: colors.tooltipBorder
                                                }}
                                            >
                                                <p className="text-xs font-semibold text-text-secondary mb-1">{label}</p>
                                                <p className="text-sm font-bold text-blue-500">
                                                    {payload[0].payload.preciseTime}
                                                </p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Bar
                                dataKey="hours"
                                fill={colors.bar}
                                radius={[4, 4, 0, 0]}
                                maxBarSize={50}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
