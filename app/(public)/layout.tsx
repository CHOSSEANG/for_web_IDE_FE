// app/(protected)/layout.tsx
import type { ReactNode } from "react"; // ReactNode 명시로 빌드 에러 제거
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AccountModalRoot from "@/components/account/AccountModalRoot";

export default function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />

      <AccountModalRoot />
    </div>
  );
}
