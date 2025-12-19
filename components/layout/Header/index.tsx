// components/layout/Header/index.tsx
"use client";

import { HeaderShell } from "./HeaderShell";
import { HeaderMenus } from "./HeaderMenus";

export default function Header() {
  return (
    <HeaderShell>
      <HeaderMenus />
    </HeaderShell>
  );
}
