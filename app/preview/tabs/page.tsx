"use client";

import { WebicTabs } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/theme-toggle";


export default function WebicTabsPreview() {
  return (
    <main className="min-h-screen bg-bg-base text-text-primary p-10">
      <div className="flex justify-end mb-6">
        <ThemeToggle />
      </div>
    
      <h1 className="text-2xl font-semibold mb-4">WebIC Modern Tabs</h1>
      <WebicTabs />
    </main>
  );
}
