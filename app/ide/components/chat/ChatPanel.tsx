"use client";

import { useEffect, useState } from "react";
import { useChat } from "@/app/ide/hooks/useChat";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

interface ChatPanelProps {
  containerId: string | number;
}

export default function ChatPanel({ containerId }: ChatPanelProps) {
  const numericContainerId = Number(containerId);
  const {
    messages,
    input,
    setInput,
    sendMessage,
    loadMoreHistory,
    isHistoryLoading,
    isSearching,
    searchMessages,
    clearSearch,
    isSearchActive,
  } = useChat(numericContainerId);

  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    const trimmed = searchKeyword.trim();
    if (!trimmed) {
      if (isSearchActive) {
        clearSearch();
      }
      return;
    }

    const timer = setTimeout(() => {
      searchMessages(trimmed);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [searchKeyword, searchMessages, clearSearch, isSearchActive]);

  const hasSearchKeyword = searchKeyword.trim().length > 0;

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

        {hasSearchKeyword && (
          <span className="text-sm text-muted-foreground">
            {isSearching ? "검색 중..." : `${messages.length}건 검색됨`}
          </span>
        )}
      </div>

      {hasSearchKeyword && !isSearching && messages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
          검색 결과가 없습니다.
        </div>
      ) : (
        <MessageList
          messages={messages}
          onReachTop={loadMoreHistory}
          isHistoryLoading={isHistoryLoading}
        />
      )}

      <MessageInput
        value={input ?? ""}
        onChange={setInput}
        onSend={sendMessage}
      />
    </div>
  );
}
