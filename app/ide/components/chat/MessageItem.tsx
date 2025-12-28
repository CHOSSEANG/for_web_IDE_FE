"use client";

import { ChatMessage } from "@/app/ide/types/chat";
import dayjs from "dayjs";

const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?background=64748b&color=fff&size=40&name=U";

interface MessageItemProps {
  message: ChatMessage;
  isMe: boolean;
}

export default function MessageItem({ message, isMe }: MessageItemProps) {
  return (
    <div className={`flex mb-3 ${isMe ? "justify-end" : "justify-start"}`}>
      {!isMe && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={message.userImgUrl || DEFAULT_AVATAR}
          alt={message.userName}
          className="w-8 h-8 rounded-full mr-2"
        />
      )}

      <div
        className={`max-w-[70%] px-3 py-2 rounded-lg text-sm ${isMe
          ? "bg-blue-600 text-white rounded-br-none"
          : "bg-bg-base text-text-primary border border-border-light rounded-bl-none"
          }`}
      >
        {!isMe && (
          <div className="text-xs text-text-muted mb-1">{message.userName}</div>
        )}

        <div>{message.message}</div>

        <div className="text-[10px] text-text-muted mt-1 text-right">
          {dayjs(message.createdAt).format("MM/DD HH:mm")}
        </div>
      </div>
    </div>
  );
}
