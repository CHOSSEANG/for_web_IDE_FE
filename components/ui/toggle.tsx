"use client";

import * as Switch from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

type ToggleProps = Switch.SwitchProps & {
  className?: string;
};

export function Toggle({ className, ...props }: ToggleProps) {
  return (
    <Switch.Root
      className={cn(
        "w-10 h-5 rounded-full bg-border-light relative",
        "data-[state=checked]:bg-blue-500",
        "transition-colors",
        className
      )}
      {...props}
    >
      <Switch.Thumb
        className={cn(
          "block w-4 h-4 bg-bg-base rounded-full shadow",
          "transition-transform",
          "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-1"
        )}
      />
    </Switch.Root>
  );
}
