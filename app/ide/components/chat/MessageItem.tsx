"use client";

import { ChatMessage } from "@/app/ide/types/chat";
import dayjs from "dayjs";

const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?background=64748b&color=fff&size=40&name=U";

// mock 단계용: 나중에 userId 기준으로 바꿔야 함
const MY_NAME = "홍길동";

interface MessageItemProps {
  message: ChatMessage;
}

export default function MessageItem({ message }: MessageItemProps) {
  const isMe = message.userName === MY_NAME;

  return (
    <div className={`flex mb-3 ${isMe ? "justify-end" : "justify-start"}`}>
      {/* 상대 메시지일 때만 프로필 표시 */}
      {!isMe && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={message.userImgUrl || DEFAULT_AVATAR}
          alt={message.userName}
          className="w-8 h-8 rounded-full mr-2"
        />
      )}

      {/* 메시지 말풍선 */}
      <div
        className={`max-w-[70%] px-3 py-2 rounded-lg text-sm ${isMe
          ? "bg-blue-600 text-white rounded-br-none"
          : "bg-bg-base text-text-primary border border-border-light rounded-bl-none"
          }`}
      >
        {/* 이름 + 시간 (상대 메시지만 이름 표시) */}
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
