"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

type SelectTriggerProps = SelectPrimitive.SelectTriggerProps & {
  className?: string;
};

type SelectContentProps = SelectPrimitive.SelectContentProps & {
  className?: string;
};

type SelectItemProps = SelectPrimitive.SelectItemProps & {
  className?: string;
};

type SelectProps = SelectPrimitive.SelectProps & {
  children?: ReactNode;
};

export function Select({ children, ...props }: SelectProps) {
  return <SelectPrimitive.Root {...props}>{children}</SelectPrimitive.Root>;
}

export const SelectTrigger = ({ className, ...props }: SelectTriggerProps) => (
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

export const SelectContent = ({ className, ...props }: SelectContentProps) => (
  <SelectPrimitive.Content
    className={cn(
      "z-50 rounded-md shadow-md border border-border-light bg-bg-raised",
      className
    )}
    {...props}
  />
);

export const SelectItem = ({ className, ...props }: SelectItemProps) => (
  <SelectPrimitive.Item
    className={cn(
      "px-3 py-2 text-sm cursor-pointer",
      "text-text-primary hover:bg-bg-subtle transition-colors",
      className
    )}
    {...props}
  />
);
