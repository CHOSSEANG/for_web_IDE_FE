// app/(protected)/layout.tsx
import type { ReactNode } from "react"; // ReactNode 명시로 빌드 에러 제거
import AccountModalRoot from "@/components/account/AccountModalRoot";

export default function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      {children}
      <AccountModalRoot />
    </>
  );
}
