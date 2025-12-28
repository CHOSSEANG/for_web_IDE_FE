"use client";

import { ChatMessage } from "@/app/ide/types/chat";
import dayjs from "dayjs";

const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?background=64748b&color=fff&size=40&name=U";

interface MessageItemProps {
  message: ChatMessage;
  isMine: boolean;
  showAvatar: boolean;
}

export default function MessageItem({
  message,
  isMine,
  showAvatar,
}: MessageItemProps) {
  const avatarSrc =
    message.userImgUrl && message.userImgUrl.trim()
      ? message.userImgUrl
      : DEFAULT_AVATAR;

  const containerClass = [
    "flex",
    isMine ? "justify-end" : "justify-start",
    showAvatar ? "gap-2" : "gap-1",
    showAvatar ? "mb-3" : "mb-1",
  ]
    .filter(Boolean)
    .join(" ");

  const bubbleClass = [
    "max-w-[70%] px-3 py-2 rounded-lg text-sm border",
    isMine
      ? "bg-blue-600 text-white border-transparent"
      : "bg-bg-base text-text-primary border-border-light",
  ].join(" ");

  const alignmentClass = isMine ? "items-end text-right" : "items-start text-left";
  const nameClass = `${alignmentClass} text-xs text-text-muted mb-1`;
  const timestampClass = `text-[10px] text-text-muted mt-1 ${isMine ? "text-right" : "text-left"}`;

  return (
    <div className={containerClass}>
      {!isMine && showAvatar && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarSrc}
          alt={message.userName}
          className="w-8 h-8 rounded-full"
        />
      )}

      <div className={`flex flex-col ${alignmentClass}`}>
        {showAvatar && (
          <div className={nameClass}>{message.userName}</div>
        )}

        <div className={bubbleClass}>{message.message}</div>

        <div className={timestampClass}>
          {dayjs(message.createdAt).format("MM/DD HH:mm")}
        </div>
      </div>

      {isMine && showAvatar && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarSrc}
          alt={message.userName}
          className="w-8 h-8 rounded-full"
        />
      )}
    </div>
  );
}
