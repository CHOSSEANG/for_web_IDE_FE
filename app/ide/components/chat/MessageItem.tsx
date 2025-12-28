"use client";

import { ChatMessage } from "@/app/ide/types/chat";

const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?background=64748b&color=fff&size=40&name=U";

interface MessageItemProps {
  message: ChatMessage;
}

export default function MessageItem({ message }: MessageItemProps) {
  const avatarSrc =
    message.userImgUrl && message.userImgUrl.trim()
      ? message.userImgUrl
      : DEFAULT_AVATAR;

  return (
    <div className="flex mb-3 justify-start">
      <img
        src={avatarSrc}
        alt={message.userName}
        className="w-8 h-8 rounded-full mr-2"
      />

      <div className="max-w-[70%] px-3 py-2 rounded-lg text-sm bg-bg-base text-text-primary border border-border-light">
        <div className="text-xs text-text-muted mb-1">{message.userName}</div>
        <div>{message.message}</div>
        <div className="text-[10px] text-text-muted mt-1 text-right">
          {message.createdAt} {/* KST 문자열 그대로 표시 */}
        </div>
      </div>
    </div>
  );
}
