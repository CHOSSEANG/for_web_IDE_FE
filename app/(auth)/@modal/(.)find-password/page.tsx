"use client";

import { useRouter } from "next/navigation";

import FindPasswordPanel from "../../find-password/FindPasswordPanel";

export default function FindPasswordModal() {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-12">
      <div className="w-full max-w-md">
        <FindPasswordPanel onClose={() => router.back()} />
      </div>
    </div>
  );
}
