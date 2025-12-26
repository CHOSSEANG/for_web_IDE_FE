"use client";

export const dynamic = "force-dynamic";

import Image from "next/image";
import { useState, useEffect } from "react";
import { FileTree } from "@/components/filetree/file-tree";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function FileTreePreviewPage() {
  const [icons, setIcons] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/icons")
      .then((res) => res.json())
      .then((data) => setIcons(data.icons));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-bg-base p-6">
      {/* Theme Toggle */}
      <div className="flex justify-end mb-6">
        <ThemeToggle />
      </div>

      <h1 className="text-2xl font-semibold mb-2">WebIC FileTree Preview</h1>
      <p className="mb-6 text-sm">
        파일트리내 아이콘 이슈로 아직 가이드 잡지 못했습니다.
      </p>

      <div className="flex w-full h-full">
        {/* LEFT : FileTree */}
        <div className="w-1/5 border p-4">
          <h2 className="font-bold mb-4">📂 FileTree Preview</h2>
          <div className="w-full h-[600px] overflow-hidden">
            <FileTree />
          </div>
        </div>

        {/* RIGHT : Icon Preview */}
        <div className="w-4/5 p-4 overflow-auto">
          <h2 className="font-bold mb-4">🖼 vsc style Icon Preview</h2>

          <div className="grid grid-cols-6 gap-4 p-6">
            {icons.map((name) => (
              <div key={name} className="flex flex-col items-center">
                <Image
                  src={`/icons/${name}`}
                  alt={`${name} icon`}
                  width={40}
                  height={40}
                  className="w-10 h-10"
                />
                <span className="text-xs mt-2">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
