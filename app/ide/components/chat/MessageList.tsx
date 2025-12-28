"use client";

import { ChatMessage } from "@/app/ide/types/chat";
import MessageItem from "./MessageItem";

type ChatMessageWithClientId = ChatMessage & {
  _clientId?: string;
};

interface MessageListProps {
  messages: ChatMessageWithClientId[];
}

export default function MessageList({ messages }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((msg) => (
        <MessageItem
          key={
            msg._clientId ??
            msg.id ??
            `${msg.createdAt}|${msg.userName}|${msg.message}`
          }
          message={msg}
        />
      ))}
    </div>
  );
}
