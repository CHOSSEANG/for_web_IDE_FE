"use client";

import type { ReactNode } from "react";

type SplitLayoutProps = {
  sidebar: ReactNode;
  editorTabs: ReactNode;
  editor: ReactNode;
  terminal: ReactNode;
};

export default function SplitLayout({
  sidebar,
  editorTabs,
  editor,
  terminal,
}: SplitLayoutProps) {
  return (
    <div className="flex h-full flex-col gap-2 px-3 py-2">
      <div className="flex flex-1 min-h-0 overflow-hidden rounded-2xl border border-white/10 bg-[#0b1020]">
        <div className="w-[320px] shrink-0 border-r border-white/10">{sidebar}</div>
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="border-b border-white/10 px-3 py-2">{editorTabs}</div>
          <div className="flex-1 min-h-0 overflow-hidden">{editor}</div>
        </div>
      </div>
      <div className="h-[220px] rounded-2xl border border-white/10">{terminal}</div>
    </div>
  );
}
