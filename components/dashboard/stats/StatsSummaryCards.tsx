"use client";

import { Card, CardContent } from "./StatsCard";
import { Activity, Clock, Calendar } from "lucide-react";

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
    currentSessionMs?: number; // Optional, defaults to 0 for dashboard
    isWorking?: boolean;
}

// ================= Helpers =================
function formatDuration(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0 || hours > 0) parts.push(`${minutes}m`);
    parts.push(`${seconds}s`);

    return parts.join(' ');
}

function formatSessionTime(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
}

function getTodayString(): string {
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
export default function StatsSummaryCards({ data, currentSessionMs = 0, isWorking = false }: StatsCardsProps) {
    const todayStr = getTodayString();
    const todayData = data?.daily?.find((d) => d.todayDate === todayStr);
    const todayTotalMs = todayData ? todayData.codingTimeMs : 0;
    const weeklyTotalMs = data?.totalWeeklyCodingTime || 0;

    // Convert currentSessionMs to seconds for display
    const sessionSeconds = Math.floor(currentSessionMs / 1000);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* 1. Current Session */}
            <Card>
                <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Activity className="w-5 h-5 text-blue-500" />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-tight">Current Session</p>
                                <p className="text-2xl font-bold tracking-tight">
                                    {formatSessionTime(sessionSeconds)}
                                </p>
                            </div>
                        </div>
                    </div>
                    {isWorking && (
                        <div className="flex items-center gap-1.5 mt-3">
                            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <p className="text-[11px] font-medium text-emerald-500 uppercase">Active now</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 2. Today's Total */}
            <Card>
                <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                            <div className="p-2 bg-sky-500/10 rounded-lg">
                                <Clock className="w-5 h-5 text-sky-500" />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-tight">Today&apos;s Total</p>
                                <p className="text-2xl font-bold tracking-tight">
                                    {formatDuration(todayTotalMs)}
                                </p>
                            </div>
                        </div>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-3 font-medium uppercase tracking-wider">{todayStr}</p>
                </CardContent>
            </Card>

            {/* 3. This Week */}
            <Card>
                <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                            <div className="p-2 bg-amber-500/10 rounded-lg">
                                <Calendar className="w-5 h-5 text-amber-500" />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-tight">This Week</p>
                                <p className="text-2xl font-bold tracking-tight">
                                    {formatDuration(weeklyTotalMs)}
                                </p>
                            </div>
                        </div>
                    </div>
                    <p className="text-[11px] font-medium text-emerald-500 mt-3 uppercase tracking-wider">
                        ↗ +12% from last week
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

/**
 * 하단 2개 카드 (Daily Average, Longest Day)
 */
export function StatsAdditionalCards({ data }: StatsCardsProps) {
    const avgMs = data?.avgWeeklyCodingTime || 0;
    const maxMs = data?.maxWeeklyCodingTime || 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <Card>
                <CardContent className="p-5">
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-tight mb-2">Daily Average (This Week)</p>
                    <h3 className="text-2xl font-bold tracking-tight">
                        {formatDuration(avgMs)}
                    </h3>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-5">
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-tight mb-2">Longest Day (This Week)</p>
                    <h3 className="text-2xl font-bold tracking-tight">
                        {formatDuration(maxMs)}
                    </h3>
                </CardContent>
            </Card>
        </div>
    );
}
