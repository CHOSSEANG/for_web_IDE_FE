import type { ReactNode } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Logo from "@/components/brand/Logo";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col">
        <div className="flex flex-col flex-1">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
