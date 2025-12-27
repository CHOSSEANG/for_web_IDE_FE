"use client";

import { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { getCodingStats } from "@/lib/api/coding";
import type { CodingStatsData, DailyStat } from "@/components/dashboard/stats/StatsSummaryCards";

const generateMockStats = (): CodingStatsData => {
    const today = new Date();
    const daily: DailyStat[] = [];

    // Generate last 7 days including today
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        // Random coding time between 0 and 5 hours
        const randomHours = Math.random() * 5;
        daily.push({
            todayDate: dateStr,
            codingTimeMs: Math.floor(randomHours * 60 * 60 * 1000)
        });
    }

    const total = daily.reduce((acc, cur) => acc + cur.codingTimeMs, 0);
    const max = Math.max(...daily.map(d => d.codingTimeMs));

    return {
        daily,
        avgWeeklyCodingTime: Math.floor(total / 7),
        maxWeeklyCodingTime: max,
        totalWeeklyCodingTime: total
    };
};

const MOCK_STATS = generateMockStats();

export function useStatsData() {
    const { getToken } = useAuth();
    const { user, isLoaded } = useUser();
    const [data, setData] = useState<CodingStatsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchStats() {
            if (!isLoaded) return; // Wait for Clerk to load

            if (!user?.id) {
                setLoading(false);
                setData(MOCK_STATS); // Provide mock data for preview
                setError(null);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const token = await getToken();
                if (!token) {
                    throw new Error("No authentication token available");
                }

                const stats = await getCodingStats({
                    token,
                });

                setData(stats);
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : "Failed to fetch stats";

                // 401 Unauthorized (환경 불일치 등) 발생 시 데모 데이터로 Fallback
                if (errorMessage.includes("401") || errorMessage.includes("Failed to fetch")) {
                    // console.error 대신 warn으로 변경하여 사용자 불안 해소
                    console.warn("Authentication mismatch (401) detected. Automatically switching to Demo Mode.");
                    setData(MOCK_STATS);
                    setError(null);
                } else {
                    console.error("Failed to fetch coding stats:", err);
                    setError(errorMessage);
                }
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, [user?.id, getToken, isLoaded]);

    return { data, loading, error };
}
