import type { ReactNode } from "react";
import Header from "@/components/layout/Header/";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "WEBIC - Main",
};

export default function WelcomeLayout({ children }: { children: ReactNode }) {
  return (
  <div className="min-h-screen bg-bg flex flex-col">
        <Header />
  
        <main className="flex-1 flex items-center justify-center py-12">
          {children}
        </main>
  
        <Footer />
  </div>
  );
}
