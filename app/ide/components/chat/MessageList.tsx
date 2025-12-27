"use client";

import { ChatMessage } from "@/app/ide/types/chat";
import MessageItem from "./MessageItem";

interface MessageListProps {
  messages: ChatMessage[];
  myUserId: number;
}

export default function MessageList({ messages, myUserId }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((msg) => (
        <MessageItem
          key={`${msg.userId}-${msg.createdAt}`}
          message={msg}
          isMe={msg.userId === myUserId}
        />
      ))}
    </div>
  );
}
