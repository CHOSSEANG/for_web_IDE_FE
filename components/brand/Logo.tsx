// components/brand/Logo.tsx

/* eslint-disable @next/next/no-img-element */

type LogoVariant = "default" | "bar" | "icon" | "webic";

interface LogoProps {
  variant?: LogoVariant;
  className?: string;
}

const logoSrcMap: Record<
  LogoVariant,
  { light: string; dark: string }
> = {
  default: {
    light: "/logo/logo-light.svg",
    dark: "/logo/logo-dark.svg",
  },
  bar: {
    light: "/logo/logo-light-bar.svg",
    dark: "/logo/logo-dark-bar.svg",
  },
  icon: {
    light: "/logo/logo-light.svg",
    dark: "/logo/logo-w.svg",
  },
  webic: {
    light: "/logo/logo-light-webic.svg",
    dark: "/logo/logo-dark-webic.svg",
  },
};

export default function Logo({
  variant = "default",
  className,
}: LogoProps) {
  const { light, dark } = logoSrcMap[variant];

  return (
    <span className={`inline-flex select-none ${className ?? ""}`}>
      {/* Light logo */}
      <img
        src={light}
        alt="WebIC Logo"
        className="block dark:hidden w-full h-full object-contain"
        draggable={false}
      />

      {/* Dark logo */}
      <img
        src={dark}
        alt="WebIC Logo"
        className="hidden dark:block w-full h-full object-contain"
        draggable={false}
        aria-hidden
      />
    </span>
  );
}
