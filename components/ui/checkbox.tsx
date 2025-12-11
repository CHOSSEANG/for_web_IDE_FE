"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

type CheckboxProps = CheckboxPrimitive.CheckboxProps & {
  className?: string;
};

export function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        "w-4 h-4 rounded-sm border border-border-light bg-bg-raised",
        "data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500",
        "flex items-center justify-center",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator>
        <Check className="w-3 h-3 text-white" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
