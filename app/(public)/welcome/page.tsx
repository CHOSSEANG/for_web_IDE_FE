"use client";
import Logo from "@/components/brand/Logo";
export default function WelcomePage() {
  return (
    <main className="w-full flex flex-col">
      <div className="flex flex-col items-center justify-center px-6 py-20 gap-20">
        <div className="flex items-center gap-2">
          <Logo variant="icon" className="w-56 h-56" />
        </div>
        {/* Hero Section */}
        <section className="text-center max-w-2xl">
          <h1 className="text-4xl font-bold mb-4">Welcome to WebIC</h1>
          <p className="text-text-muted text-lg">
            브라우저에서 채팅과 시간을 체크하며 함께 더 빠르게 협업하는 Web IDE
          </p>
        </section>

        {/* Feature Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          <div className="p-6 rounded-lg bg-bg-raised border border-border-light">
            <h3 className="font-semibold mb-2">AI Assisted Coding</h3>
            <p className="text-sm text-text-muted">
              코드 자동완성, 분석, 리팩토링까지 지원
            </p>
          </div>

          <div className="p-6 rounded-lg bg-bg-raised border border-border-light">
            <h3 className="font-semibold mb-2">Real-time Collaboration</h3>
            <p className="text-sm text-text-muted">
              Liveblocks 기반 실시간 커서/편집/채팅
            </p>
          </div>

          <div className="p-6 rounded-lg bg-bg-raised border border-border-light">
            <h3 className="font-semibold mb-2">VSCode-Level Editor</h3>
            <p className="text-sm text-text-muted">
              Monaco Editor 기반 전문 개발 환경
            </p>
          </div>
        </section>

      </div>

      
    </main>
  );
}
