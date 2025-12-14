// app/(auth)/layout.tsx
import type { ReactNode } from "react";

export const metadata = {
  title: "WebIC · 인증",
};

type AuthLayoutProps = {
  children: ReactNode;
  modal: ReactNode;
};

export default function AuthLayout({ children, modal }: AuthLayoutProps) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
