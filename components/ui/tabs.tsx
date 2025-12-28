"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function WebicTabs() {
  const [active, setActive] = useState("index.tsx");

  const tabs = [
    "index.tsx",
    "app/page.tsx",
    "README.md",
    "api/route.ts",
  ];

  return (
    <div className="flex overflow-x-auto bg-bg-subtle border-b border-border-strong">

      {tabs.map((tab) => {
        const isActive = tab === active;

        return (
          <div
            key={tab}
            onClick={() => setActive(tab)}
            className={cn(
              "relative flex items-center gap-2 px-4 py-2 cursor-pointer select-none",
              "border-r border-border-strong",
              "min-w-[120px] whitespace-nowrap transition-colors",
              isActive
                ? "bg-bg-base font-[300] text-text-primary border-b border-blue-400"
                : "bg-bg-subtle font-[300] text-text-muted border-b-0 border-border-light hover:bg-bg-raised"
            )}
          >
            {/* 텍스트 영역 */}
            <span className="inline-block min-w-[90px]">
              {tab}
            </span>

            {/* 닫기 버튼 */}
            <button
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "transition-colors",
                isActive
                  ? "font-[300] text-text-primary"
                  : "font-[300] text-text-muted hover:text-text-primary"
              )}
            >
              <X className="w-3 h-3" />
            </button>

            {/* Indicator (Active 탭 하단 파란 밑줄) */}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-400" />
            )}
          </div>
        );
      })}

    </div>
  );
}
