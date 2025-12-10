"use client";

import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: 
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "destructive"
    | "icon";
}

export function Button({
  className,
  variant = "primary",
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  const base =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary:
      "text-base font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors focus:ring-blue-400",

    secondary:
      "text-base font-medium rounded-lg bg-bg-subtle text-text-primary border border-border-light hover:bg-bg-raised",

    outline:
      "text-base font-medium rounded-lg border border-border-strong text-text-primary bg-transparent hover:bg-bg-subtle",

    ghost:
      "text-base font-medium rounded-lg text-text-primary bg-transparent hover:bg-bg-subtle border border-border-light",


    destructive:
      "text-base font-semibold rounded-lg bg-error text-white hover:bg-opacity-80 focus:ring-error",

    icon:
      "w-10 h-10 flex items-center justify-center rounded-md " +
      "bg-transparent border-none p-0 " +
      "text-text-primary transition-colors " +
      "hover:text-[var(--icon-hover-light)] " +
      "dark:hover:text-[var(--icon-hover-dark)]",

  };

  return (
    <Comp
      className={cn(base, variants[variant], className)}
      {...props}
    />
  );
}
