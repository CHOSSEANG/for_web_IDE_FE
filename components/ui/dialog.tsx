"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;

export function DialogOverlay({ className, ...props }) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        "fixed inset-0 bg-black/40 backdrop-blur-sm",
        "data-[state=open]:animate-fadeIn data-[state=closed]:animate-fadeOut",
        className
      )}
      {...props}
    />
  );
}

export function DialogPortal({ children }) {
  return (
    <DialogPrimitive.Portal>
      <DialogOverlay />
      {children}
    </DialogPrimitive.Portal>
  );
}

export function DialogContent({ className, ...props }) {
  return (
    <DialogPortal>
      <DialogPrimitive.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-full max-w-md",
          "bg-bg-raised border border-border-light shadow-xl",
          "rounded-xl p-6",
          "transform -translate-x-1/2 -translate-y-1/2",
          "data-[state=open]:animate-scaleIn data-[state=closed]:animate-scaleOut",
          "text-text-primary",
          className
        )}
        {...props}
      >
        {props.children}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

export function DialogHeader({ className, ...props }) {
  return (
    <div className={cn("mb-4 text-left", className)} {...props} />
  );
}

export function DialogTitle({ className, ...props }) {
  return (
    <h2
      className={cn("text-xl font-semibold text-text-primary", className)}
      {...props}
    />
  );
}

export function DialogDescription({ className, ...props }) {
  return (
    <p
      className={cn("text-text-secondary text-sm", className)}
      {...props}
    />
  );
}

export function DialogClose() {
  return (
    <DialogPrimitive.Close className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors">
      <X className="w-5 h-5" />
    </DialogPrimitive.Close>
  );
}
