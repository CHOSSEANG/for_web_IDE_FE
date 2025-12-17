"use client";
import Logo from "@/components/brand/Logo";

// import Logo from "@/public/Logo"; 

export default function Footer() {
  return (
    <footer className="w-full py-6 px-8 border-t border-border-light flex justify-between items-center text-sm text-text-muted">
      {/* 서비스 로고 */}
      <div className="flex items-center gap-2">
        <Logo variant="icon" className="w-6 h-6" />
        <span>© 2025 WebIC Inc. All rights reserved.</span>
      </div>

      {/* 회사 정보 */}
      <div className="text-xs">
        브라우저 기반 IDE와 AI 협업의 새로운 경험
      </div>
    </footer>
  );
}
