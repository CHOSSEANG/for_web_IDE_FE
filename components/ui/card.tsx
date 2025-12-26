import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={`rounded-2xl bg-white/70 shadow-sm border border-slate-200 dark:bg-slate-900/70 dark:border-slate-800 ${className ?? ""}`}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: CardContentProps) {
  return (
    <div className={`p-4 space-y-4 ${className ?? ""}`} {...props} />
  );
}
