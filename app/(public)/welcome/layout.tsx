import type { ReactNode } from "react";
import SiteShell from "@/components/site-shell";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "WEBIC - Welcome to web ide service home",
};

export default function WelcomeLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <SiteShell>
          {children}
        </SiteShell>
      </main>
      <Footer />
    </div>
  );
}
