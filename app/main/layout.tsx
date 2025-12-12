import type { ReactNode } from "react";

export const metadata = {
  title: "WEBIC - Main",
};

export default function WelcomeLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
