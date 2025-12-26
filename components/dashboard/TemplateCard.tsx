"use client";

import type { ReactNode } from "react";

type TemplateCardProps = {
  icon: ReactNode;
  name: string;
  desc: string;
  onClick?: () => void;
};

export default function TemplateCard({
  icon,
  name,
  desc,
  onClick,
}: TemplateCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        w-full text-left
        rounded-xl
        bg-slate-200 dark:bg-slate-800
        border border-slate-300 dark:border-slate-700
        p-4
        flex items-center gap-4
        hover:bg-slate-300/60 dark:hover:bg-slate-700
        transition
      "
    >
      <div className="w-12 h-12 flex items-center justify-center shrink-0">
        {icon}
      </div>

      <div>
        <p className="text-sm font-semibold">{name}</p>
        <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400">
          {desc}
        </p>
      </div>
    </button>
  );
}
