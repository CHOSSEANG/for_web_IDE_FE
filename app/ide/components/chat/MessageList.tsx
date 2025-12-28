"use client";

import { ChatMessage } from "@/app/ide/types/chat";
import MessageItem from "./MessageItem";

type ChatMessageWithClientId = ChatMessage & {
  _clientId?: string;
};

interface MessageListProps {
  messages: ChatMessageWithClientId[];
  currentUserId?: number;
}

type RenderedMessage = ChatMessageWithClientId & {
  isMine: boolean;
  isFirstInGroup: boolean;
};

export default function MessageList({
  messages,
  currentUserId,
}: MessageListProps) {
  const processedMessages: RenderedMessage[] = messages.map((message, index) => {
    const prevMessage = index > 0 ? messages[index - 1] : undefined;
    const prevUserId = prevMessage?.userId;
    const isSameSender =
      prevUserId != null &&
      message.userId != null &&
      prevUserId === message.userId;

    const isMine =
      currentUserId != null && message.userId === currentUserId;

    return {
      ...message,
      isMine,
      isFirstInGroup: !isSameSender,
    };
  });

  return (
    <div className="flex-1 overflow-y-auto">
      {processedMessages.map((msg) => (
        <MessageItem
          key={
            msg._clientId ??
            msg.id ??
            `${msg.createdAt}|${msg.userName}|${msg.message}`
          }
          message={msg}
          isMine={msg.isMine}
          showAvatar={msg.isFirstInGroup}
        />
      ))}
    </div>
  );
}
