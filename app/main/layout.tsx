import type { ReactNode } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function IDELayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full flex flex-col">
      <Header />

      {/* ❗ 가운데 정렬 제거 */}
      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
}

export const metadata = { title: "WEBIC - IDE Dashboard" };