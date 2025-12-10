"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export function Select({ children, ...props }) {
  return <SelectPrimitive.Root {...props}>{children}</SelectPrimitive.Root>;
}

export const SelectTrigger = ({ className, ...props }) => (
  <SelectPrimitive.Trigger
    className={cn(
      "flex items-center justify-between px-3 py-2 rounded-md text-sm",
      "bg-bg-raised border border-border-light text-text-primary",
      "placeholder:text-text-muted",
      "focus:outline-none focus:ring-2 focus:ring-blue-400/40",
      className
    )}
    {...props}
  >
    <SelectPrimitive.Value />
    <ChevronDown className="w-4 h-4 text-text-muted" />
  </SelectPrimitive.Trigger>
);

export const SelectContent = ({ className, ...props }) => (
  <SelectPrimitive.Content
    className={cn(
      "z-50 rounded-md shadow-md border border-border-light bg-bg-raised",
      className
    )}
    {...props}
  />
);

export const SelectItem = ({ className, ...props }) => (
  <SelectPrimitive.Item
    className={cn(
      "px-3 py-2 text-sm cursor-pointer",
      "text-text-primary hover:bg-bg-subtle transition-colors",
      className
    )}
    {...props}
  />
);
