"use client";

import { ChatMessage } from "@/app/ide/types/chat";
import MessageItem from "./MessageItem";

type ChatMessageWithClientId = ChatMessage & {
  _clientId?: string;
};

interface MessageListProps {
  messages: ChatMessageWithClientId[];
  myUserId: number;
}

export default function MessageList({ messages, myUserId }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((msg) => (
        <MessageItem
          key={msg._clientId ?? `${msg.userId}|${msg.createdAt}|${msg.message}`}
          message={msg}
          isMe={msg.userId === myUserId}
        />
      ))}
    </div>
  );
}
