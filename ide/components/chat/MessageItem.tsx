"use client";

import { ChatMessage } from "@/app/ide/types/chat";

interface MessageItemProps {
  message: ChatMessage;
}

export default function MessageItem({ message }: MessageItemProps) {
  return (
    <div className={message.sender === "me" ? "text-right" : "text-left"}>
      {message.content}
    </div>
  );
}
