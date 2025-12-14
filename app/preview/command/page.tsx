"use client";

import { useState } from "react";
import { CommandDialog } from "@/components/ui/command-dialog";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function CommandPreview() {
  const [open, setOpen] = useState(false);

  return (
    <main className="min-h-screen bg-bg-base text-text-primary p-10">

      {/* 상단 테마 토글 */}
      <div className="flex justify-end mb-6">
        <ThemeToggle />
      </div>

      <h1 className="text-2xl font-semibold mb-4">WebIC Command Palette</h1>

      <Button variant="outline" onClick={() => setOpen(true)}>
        커맨드 팔레트 열기
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen} />
    </main>
  );
}
