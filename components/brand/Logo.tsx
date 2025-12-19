// @/components/brand/Logo.tsx

"use client";

import Image from "next/image";
import clsx from "clsx";
import { useTheme } from "next-themes";

type LogoVariant = "default" | "bar" | "icon" | "webic";

interface LogoProps {
  variant?: LogoVariant;
  className?: string;
  priority?: boolean;
}

export default function Logo({
  variant = "default",
  className,
  priority = false,
}: LogoProps) {
  const { theme, resolvedTheme } = useTheme();

  /**
   * ⭐ 핵심 포인트
   * - resolvedTheme가 없을 수 있음
   * - 그 경우에도 로고는 보여야 함
   */
  const effectiveTheme =
    resolvedTheme === "dark" || theme === "dark" ? "dark" : "light";

  const srcMap: Record<"light" | "dark", Record<LogoVariant, string>> = {
    dark: {
      default: "/logo/logo-dark.svg",
      bar: "/logo/logo-dark-bar.svg",
      icon: "/logo/logo-w.svg",
      webic: "/logo/logo-dark-webic.svg",
    },
    light: {
      default: "/logo/logo-light.svg",
      bar: "/logo/logo-light-bar.svg",
      icon: "/logo/logo-light.svg",
      webic: "/logo/logo-light-webic.svg",
    },
  };

  const src = srcMap[effectiveTheme][variant];

  return (
    <span
      className={clsx("inline-flex select-none", className)}
      suppressHydrationWarning
    >
      <Image
        key={`${effectiveTheme}-${variant}`} // 테마 변경 시 강제 갱신
        src={src}
        alt="WebIC Logo"
        width={240}
        height={80}
        priority={priority}
        className="w-full h-full object-contain"
      />
    </span>
  );
}
