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
  const { resolvedTheme } = useTheme();

  const theme = resolvedTheme === "dark" ? "dark" : "light";

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

  const src = srcMap[theme][variant];

  return (
    <span className={clsx("inline-flex select-none", className)}>
      <Image
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
