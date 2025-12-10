"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/app/providers/theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      className=" 
        rounded-md bg-transparent border-none 
        text-text-primary transition-colors
        hover:text-[var(--icon-hover-light)]
        dark:hover:text-[var(--icon-hover-dark)]
      "
    >
      {theme === "dark" ? (
        <Sun className="w-6 h-6" />
      ) : (
        <Moon className="w-6 h-6" />
      )}
    </button>
  );
}
