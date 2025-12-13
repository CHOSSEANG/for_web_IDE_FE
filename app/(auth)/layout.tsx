// app/(auth)/layout.tsx
export const metadata = {
  title: "WebIC · 인증",
};

export default function AuthLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal?: React.ReactNode;
}) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
