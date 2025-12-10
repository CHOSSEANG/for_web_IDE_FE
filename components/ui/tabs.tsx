"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useTheme } from "@/app/providers/theme-provider";

export function WebicTabs() {
  const [active, setActive] = useState("index.tsx");
  const { theme } = useTheme(); 

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
                ? theme === "dark"
                  ? "bg-[#2D2D2D] font-[300] text-text-primary border-b-1 border-blue-400"
                  : "bg-bg-code-block font-[300] text-text-primary border-b-1 border-blue-400"
                :
                    theme === "dark"
                  ? "bg-[#1E1E1E] font-[300] text-text-muted border-b-0 border-border-light hover:bg-[#2D2D2D]"
                  : "bg-bg-raised font-[300] text-text-muted border-b-0 border-border-light hover:bg-bg-subtle"
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
