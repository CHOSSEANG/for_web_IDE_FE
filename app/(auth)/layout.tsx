// app/(auth)/layout.tsx
import type { ReactNode } from "react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "WebIC · 인증",
};

type AuthLayoutProps = {
  children: ReactNode;
  modal: ReactNode;
};

export default function AuthLayout({ children, modal }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12">
        {children}
        {modal}
      </main>
      
       <Footer />
    </div>
  );
}
