"use client";

import { useChat } from "@/app/ide/hooks/useChat";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useMemo, useState } from "react";

interface ChatPanelProps {
  containerId: string | number;
}

export default function ChatPanel({ containerId }: ChatPanelProps) {
  const numericContainerId = Number(containerId);
  const { messages, input, setInput, sendMessage } =
    useChat(numericContainerId);

  const [searchKeyword, setSearchKeyword] = useState("");
  const isSearching = searchKeyword.trim().length > 0;

  const filteredMessages = useMemo(() => {
    if (!isSearching) return messages;

    return messages.filter((msg) =>
      msg.message.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  }, [messages, searchKeyword, isSearching]);

  return (
    <div className="h-full flex flex-col p-4">
      <div className="mb-2 flex items-center gap-3">
        <input
          type="text"
          placeholder="메시지 검색"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="w-64 px-3 py-1 rounded bg-white text-black placeholder:text-gray-400 text-sm"
        />

        {isSearching && (
          <span className="text-sm text-muted-foreground">
            {filteredMessages.length}건 검색됨
          </span>
        )}
      </div>

      {isSearching && filteredMessages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
          검색 결과가 없습니다.
        </div>
      ) : (
        <MessageList messages={filteredMessages} />
      )}

      <MessageInput
        value={input ?? ""}
        onChange={setInput}
        onSend={sendMessage}
      />
    </div>
  );
}
