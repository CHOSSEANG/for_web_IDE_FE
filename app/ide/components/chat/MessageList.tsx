 "use client";

import type { UIEvent } from "react";
import { ChatMessage } from "@/app/ide/types/chat";
import MessageItem from "./MessageItem";

 interface MessageListProps {
   messages: ChatMessage[];
   onReachTop?: () => void;
   isHistoryLoading?: boolean;
 }

export default function MessageList({
  messages,
  onReachTop,
  isHistoryLoading,
}: MessageListProps) {
  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    if (
      event.currentTarget.scrollTop === 0 &&
      onReachTop &&
      !isHistoryLoading
    ) {
      onReachTop();
    }
  };

  return (
    <div
      className="flex-1 overflow-y-auto"
      onScroll={handleScroll}
    >
      {isHistoryLoading && (
        <div className="text-xs text-muted-foreground text-center py-1">
          이전 메시지 로딩 중...
        </div>
      )}
      {messages.map((msg) => (
        <MessageItem key={`${msg.createdAt}-${msg.userName}`} message={msg} />
      ))}
    </div>
  );
}
