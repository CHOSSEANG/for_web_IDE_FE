"use client";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
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
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis
                                dataKey="shortDate"
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 12, fill: '#64748B' }}
                                dy={10}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 12, fill: '#64748B' }}
                                tickFormatter={(value: number) => `${value}h`}
                            />
                            <Tooltip
                                cursor={{ fill: '#F1F5F9' }}
                                content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="bg-white dark:bg-slate-900 p-3 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg">
                                                <p className="text-xs font-semibold text-slate-500 mb-1">{label}</p>
                                                <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
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
                                fill="#3B82F6"
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
