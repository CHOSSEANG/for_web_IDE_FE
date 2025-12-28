"use client";

import { useChat } from "@/app/ide/hooks/useChat";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useEffect, useRef, useState } from "react";
import { useWebIC } from "@/app/ide/contexts/WebICContext";

interface ChatPanelProps {
  containerId: string | number;
}

export default function ChatPanel({ containerId }: ChatPanelProps) {
  const numericContainerId = Number(containerId);
  const { myUserId } = useWebIC();

  const {
    messages,
    searchResults,
    input,
    setInput,
    sendMessage,
    fetchInitialChats,
    fetchOlderChats,
    searchChats,
  } = useChat(numericContainerId, myUserId);

  const [searchKeyword, setSearchKeyword] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  /* ==========================
     초기 채팅 조회 (container 변경 시)
  ========================== */
  useEffect(() => {
    fetchInitialChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numericContainerId]);

  /* ==========================
     검색 (debounce 300ms)
  ========================== */
  useEffect(() => {
    const id = setTimeout(() => {
      searchChats(searchKeyword);
    }, 300);

    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKeyword]);

  const isSearching = searchKeyword.trim().length > 0;
  const renderedMessages = isSearching ? searchResults : messages;

  /* ==========================
     스크롤 최상단 → 과거 채팅 로드
  ========================== */
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    if (el.scrollTop === 0 && !isSearching) {
      fetchOlderChats();
    }
  };

  return (
    <div className="h-full flex flex-col p-4">
      {/* 검색 바 */}
      <div className="mb-2 flex items-center gap-3">
        <input
          type="text"
          placeholder="메시지 검색"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="w-full px-3 py-1.5 rounded bg-bg-base border border-border-light text-text-primary placeholder:text-text-muted text-sm outline-none focus:ring-1 focus:ring-blue-500"
        />

        {isSearching && (
          <span className="text-sm text-text-muted">
            {renderedMessages.length}건 검색됨
          </span>
        )}
      </div>

      {/* 메시지 영역 (단일 스크롤 컨테이너) */}
      {isSearching && renderedMessages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
          검색 결과가 없습니다.
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto"
          onScroll={handleScroll}
        >
          <MessageList messages={renderedMessages} myUserId={myUserId} />
        </div>
      )}

      {/* 입력창 */}
      <MessageInput
        value={input ?? ""}
        onChange={setInput}
        onSend={sendMessage}
      />
    </div>
  );
}
