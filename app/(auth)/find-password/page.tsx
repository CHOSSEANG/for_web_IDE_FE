"use client";

import { useRouter } from "next/navigation";

import FindPasswordPanel from "./FindPasswordPanel";

export default function FindAccountPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen w-full flex items-center justify-center px-4 py-12">
      <FindPasswordPanel onClose={() => router.push("/sign-in")} />
    </main>
  );
}
