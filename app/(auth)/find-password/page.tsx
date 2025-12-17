"use client";

import { useRouter } from "next/navigation";

import FindPasswordPanel from "./FindPasswordPanel";

export default function FindAccountPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center">
      <FindPasswordPanel onClose={() => router.push("/sign-in")} />
    </main>
  );
}
