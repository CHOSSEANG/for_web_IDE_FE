import type { ReactNode } from "react";

export default function SiteShell({ children }: { children: ReactNode }) {
  return (
    <section className="w-full max-w-6xl mx-auto px-6">
      {children}
    </section>
  );
}
