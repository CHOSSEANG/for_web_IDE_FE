"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ThemeToggle } from "./theme-toggle";
import { UserToggle } from "./UserToggle";

const menuItems = [
  { label: "회사소개", href: "/company" },
  { label: "서비스 소개", href: "/about" },
  { label: "문의하기", href: "/contact" },
  { label: "샘플 회사 소개", href: "/company/sample" },
  { label: "샘플 문의하기", href: "/contact/sample" },
];

type SiteShellProps = {
  children: ReactNode;
};

export default function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-text-primary">
      <header className="w-full border-b border-border-light bg-white/95 px-6 py-4 shadow-sm shadow-slate-900/5 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6">
          <Link
            href="/welcome"
            className="text-lg font-semibold uppercase tracking-[0.3em] text-text-primary"
          >
            WebIC
          </Link>
          <nav className="flex flex-1 items-center justify-center gap-5 text-xs font-semibold uppercase tracking-[0.15em] text-text-muted">
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-text-primary">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 text-sm">
            <Link
              href="/sign-in"
              className="rounded-full border border-border-light px-4 py-2 font-medium text-text-primary transition hover:border-text-primary"
            >
              로그인
            </Link>
            <Link
              href="/sign-up"
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              회원가입
            </Link>
            <UserToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="flex-1">{children}</div>

      <footer className="w-full border-t border-border-light bg-white px-6 py-6 text-sm text-text-muted">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo/webic_logo.svg" className="w-5 h-5" alt="WebIC Logo" />
            <span>© 2025 WebIC Inc. All rights reserved.</span>
          </div>
          <p className="text-xs">브라우저 기반 IDE와 AI 협업의 새로운 경험</p>
        </div>
      </footer>
    </div>
  );
}
