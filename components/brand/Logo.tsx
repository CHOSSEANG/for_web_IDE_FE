"use client";

import Image from "next/image";
import clsx from "clsx";

type LogoVariant =
  | "default"
  | "bar"
  | "icon"
  | "webic";

type Theme = "light" | "dark";

interface LogoProps {
  variant?: LogoVariant;
  theme?: Theme;
  className?: string;
  priority?: boolean;
}

export default function Logo({
  variant = "default",
  theme = "dark",
  className,
  priority = false,
}: LogoProps) {
  const srcMap: Record<Theme, Record<LogoVariant, string>> = {
    dark: {
      default: "/logo/logo-dark.svg",
      bar: "/logo/logo-dark-bar.svg",
      icon: "/logo/logo-w.svg",
      webic: "/logo/logo-dark-webic.svg",
    },
    light: {
      default: "/logo/logo-light.svg",
      bar: "/logo/logo-light-bar.svg",
      icon: "/logo/logo-w.svg",
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
