import { ThemeToggle } from "@/components/theme-toggle";

export function Topbar() {
  return (
    <div className="w-full h-12 px-4 flex items-center justify-between bg-bg-raised border-b border-border-light">
      {/* 왼쪽 영역 */}
      <div className="text-text-secondary text-sm font-medium">
        WEBIC IDE
      </div>

      {/* 오른쪽 영역 (테마 토글) 상단오른쪽으로 고정 */}
      <div className="absolute top-3 right-3">
        <ThemeToggle />
      </div>
    </div>
  );
}
