// app/(protected)/layout.tsx
import AccountModalRoot from "@/components/account/AccountModalRoot";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <AccountModalRoot />
    </>
  );
}
