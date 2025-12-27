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
        <img
          src={message.userImgUrl || DEFAULT_AVATAR}
          alt={message.userName}
          className="w-8 h-8 rounded-full mr-2"
        />
      )}

      <div
        className={`max-w-[70%] px-3 py-2 rounded-lg text-sm ${
          isMe
            ? "bg-indigo-500 text-white rounded-br-none"
            : "bg-white/10 text-white rounded-bl-none"
        }`}
      >
        {!isMe && (
          <div className="text-xs text-gray-300 mb-1">{message.userName}</div>
        )}

        <div>{message.message}</div>

        <div className="text-[10px] text-gray-300 mt-1 text-right">
          {dayjs(message.createdAt).format("MM/DD HH:mm")}
        </div>
      </div>
    </div>
  );
}
