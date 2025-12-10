"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

export function CommandDialog({ open, onOpenChange }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay
          className={cn(
            "fixed inset-0 z-50 backdrop-blur-sm",
            // WebIC Light/Dark overlay 색
            "bg-black/40 dark:bg-black/60"
          )}
        />

        {/* Content */}
        <Dialog.Content
          className={cn(
            "fixed z-50 top-[20%] left-1/2 -translate-x-1/2",
            "w-[550px] rounded-md shadow-xl border",
            // WebIC 테마 적용
            "bg-bg-raised border-border-light text-text-primary",
            "focus:outline-none"
          )}
        >
          {/* 검색 입력 영역 */}
          <div
            className={cn(
              "flex items-center gap-2 px-4 py-3 border-b",
              "bg-bg-subtle border-border-light"
            )}
          >
            <Search className="w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="명령어 또는 파일 검색..."
              autoFocus
              className={cn(
                "flex-1 bg-transparent outline-none text-text-primary placeholder:text-text-muted"
              )}
            />
          </div>

          {/* 리스트 영역 */}
          <div className="max-h-[250px] overflow-y-auto py-2">
            <CommandItem label="파일 만들기" />
            <CommandItem label="폴더 만들기" />
            <CommandItem label="파일 이름 변경" />
            <CommandItem label="파일 삭제" />
            <CommandItem label="설정 열기" />

            <div className="px-4 py-2 text-xs text-text-muted">
              ⌘ + P 로 빠른 실행
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function CommandItem({ label }) {
  return (
    <div
      className={cn(
        "px-4 py-2 cursor-pointer text-sm",
        "hover:bg-bg-subtle hover:text-text-primary",
        "transition-colors"
      )}
    >
      {label}
    </div>
  );
}
