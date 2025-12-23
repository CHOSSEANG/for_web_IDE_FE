"use client";

import { ChatMessage } from "@/app/ide/types/chat";
import MessageItem from "./MessageItem";

interface MessageListProps {
  messages: ChatMessage[];
}

export default function MessageList({ messages }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((msg) => (
        <MessageItem key={`${msg.createdAt}-${msg.userName}`} message={msg} />
      ))}
    </div>
  );
}
