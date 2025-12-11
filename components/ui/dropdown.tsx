"use client";

import {
  DropdownMenu as ShadDropdown,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@radix-ui/react-dropdown-menu";
import type {
  DropdownMenuProps,
  DropdownMenuContentProps,
  DropdownMenuItemProps,
  DropdownMenuSeparatorProps,
  DropdownMenuLabelProps,
} from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

export const DropdownMenu = ShadDropdown;
export { DropdownMenuTrigger };

export function Dropdown({
  children,
  align = "start",
  ...props
}: DropdownMenuProps) {
  return (
    <DropdownMenu align={align} {...props}>
      {children}
    </DropdownMenu>
  );
}

export function DropdownContent({ className, ...props }: DropdownMenuContentProps) {
  return (
    <DropdownMenuContent
      sideOffset={6}
      className={cn(
        "min-w-[180px] rounded-lg p-1 shadow-xl",
        "bg-bg-raised border border-border-light",
        "animate-in fade-in zoom-in-95",
        className
      )}
      {...props}
    />
  );
}

export function DropdownItem({ className, ...props }: DropdownMenuItemProps) {
  return (
    <DropdownMenuItem
      className={cn(
        "flex cursor-pointer select-none items-center rounded-md px-3 py-2 text-text-primary",
        "outline-none text-sm",
        "hover:bg-bg-subtle hover:text-text-primary",
        "focus:bg-bg-subtle",
        className
      )}
      {...props}
    />
  );
}

export function DropdownSeparator({ className, ...props }: DropdownMenuSeparatorProps) {
  return (
    <DropdownMenuSeparator
      className={cn("my-1 h-[1px] bg-border-light", className)}
      {...props}
    />
  );
}

export function DropdownLabel({ className, ...props }: DropdownMenuLabelProps) {
  return (
    <DropdownMenuLabel
      className={cn("px-3 py-1.5 text-text-secondary text-xs", className)}
      {...props}
    />
  );
}

export { DropdownMenuGroup };
export { DropdownMenuContent };
export { DropdownMenuItem };
export { DropdownMenuSeparator };
