"use client";

// Statistics view component for IDE integration
import { useUser } from "@clerk/nextjs";
import StatsSummaryCards, { StatsAdditionalCards } from "@/components/dashboard/stats/StatsSummaryCards";
import CodingActivityChart from "@/components/dashboard/stats/CodingActivityChart";
import { useStatsData } from "@/app/dashboard/stats/hooks/useStatsData";
import { useCodingTimerStore } from "@/lib/store/useCodingTimerStore";

export default function StatisticsView() {
    const { user } = useUser();
    const { data, loading, error } = useStatsData();
    const { currentSessionMs, isWorking } = useCodingTimerStore();

    if (loading) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-bg-base">
                <p className="text-text-muted">통계를 불러오는 중...</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-bg-base">
                <p className="text-error">통계를 불러오지 못했습니다: {error || "알 수 없는 오류"}</p>
            </div>
        );
    }

    return (
        <div className="h-full w-full overflow-y-auto bg-bg-base">
            <main className="p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full">
                <div className="flex flex-col gap-1 mb-8">
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                        코딩 시간 통계
                        {!loading && !user && (
                            <span className="text-[10px] bg-warning/10 text-warning px-2 py-0.5 rounded border border-warning/20 uppercase font-bold tracking-widest">
                                데모 모드
                            </span>
                        )}
                    </h1>
                    <p className="text-sm text-text-muted">
                        {(!user && !loading) ? (
                            "미로그인 상태입니다. 데모 데이터를 표시하며, 실시간 타이머만 로컬에서 작동합니다."
                        ) : (
                            "실시간 코딩 시간 및 주간 통계를 확인해보세요."
                        )}
                    </p>
                </div>

                {/* Top 3 Cards */}
                <StatsSummaryCards data={data} currentSessionMs={currentSessionMs} isWorking={isWorking} />

                {/* Main Chart */}
                <CodingActivityChart data={data?.daily} />

                {/* Bottom 2 Cards */}
                <StatsAdditionalCards data={data} />
            </main>
        </div>
    );
}
