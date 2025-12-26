 "use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import { ChatMessage } from "@/app/ide/types/chat";
import { useAuth } from "@clerk/nextjs";
import { fetchChatHistory, searchChatMessages } from "@/lib/api/chat";

type RawChatMessage = ChatMessage | (Partial<ChatMessage> & Record<string, unknown>);

let nextMessageId = 1;

function normalizeChatMessage(raw: RawChatMessage): ChatMessage {
  const messageText =
    typeof raw.message === "string"
      ? raw.message
      : typeof raw.content === "string"
      ? raw.content
      : "";
  const createdAt =
    typeof raw.createdAt === "string"
      ? raw.createdAt
      : new Date().toISOString();
  const sender =
    raw.sender === "me" || raw.sender === "other" ? raw.sender : "other";

  return {
    id: typeof raw.id === "number" ? raw.id : nextMessageId++,
    sender,
    content: typeof raw.content === "string" ? raw.content : messageText,
    userName: typeof raw.userName === "string" ? raw.userName : "알 수 없음",
    userImgUrl: typeof raw.userImgUrl === "string" ? raw.userImgUrl : "",
    message: messageText,
    createdAt,
  };
}

const CHAT_HISTORY_LIMIT = 40;

const sortChronologically = (items: ChatMessage[]) =>
  [...items].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

const mergeChronologically = (base: ChatMessage[], incoming: ChatMessage[]) => {
  const map = new Map<number, ChatMessage>();
  base.forEach((msg) => map.set(msg.id, msg));
  incoming.forEach((msg) => map.set(msg.id, msg));
  return sortChronologically(Array.from(map.values()));
};

/**
 * useChat 훅은 containerId를 number로만 받는다.
 * (백엔드 / 도메인 기준)
 */
export function useChat(
  containerId: number
): {
  messages: ChatMessage[];
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: () => void;
  loadMoreHistory: () => void;
  isHistoryLoading: boolean;
  searchMessages: (keyword: string) => Promise<void>;
  clearSearch: () => void;
  isSearchActive: boolean;
  isSearching: boolean;
} {
  const { getToken, isSignedIn } = useAuth();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [hasMoreHistory, setHasMoreHistory] = useState(true);
  const hasMoreRef = useRef(true);
  const historyCursorRef = useRef<string | null>(null);
  const searchActiveRef = useRef(searchActive);
  const isHistoryLoadingRef = useRef(false);
  const stompClientRef = useRef<Client | null>(null);

  /* ==========================
      STOMP 연결 & 구독
  ========================== */
  useEffect(() => {
    if (!isSignedIn) return;

    let client: Client | null = null;

    const connect = async () => {
      const token = await getToken({ template: "jwt" });
      if (!token) return;
      const WS_URL =
        process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8080/ws";

      client = new Client({
        brokerURL: WS_URL,
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
        reconnectDelay: 5000,
        onConnect: () => {
          client?.subscribe(`/sub/chat/${containerId}`, (frame) => {
            const rawBody = JSON.parse(frame.body) as RawChatMessage;
            const normalized = normalizeChatMessage(rawBody);

            setMessages((prev) => mergeChronologically(prev, [normalized]));
          });
        },
      });

      client.activate();
      stompClientRef.current = client;
    };

    connect();

    return () => {
      client?.deactivate();
      stompClientRef.current = null;
    };
  }, [containerId, getToken, isSignedIn]);

  /* ==========================
      메시지 전송
  ========================== */
  const setHistoryLoading = (value: boolean) => {
    isHistoryLoadingRef.current = value;
    setIsHistoryLoading(value);
  };

  const setSearchActiveState = (value: boolean) => {
    searchActiveRef.current = value;
    setSearchActive(value);
  };

  const loadHistory = useCallback(
    async (options: { reset?: boolean } = {}) => {
    if (!containerId || !isSignedIn) return;
    if (searchActiveRef.current) return;
    if (!options.reset && !hasMoreRef.current) return;
    if (isHistoryLoadingRef.current) return;

    if (options.reset) {
      hasMoreRef.current = true;
      setHasMoreHistory(true);
      historyCursorRef.current = null;
    }

    setHistoryLoading(true);
    try {
      const token = await getToken({ template: "jwt" });
      if (!token) return;

      const before = options.reset || !historyCursorRef.current
        ? new Date().toISOString()
        : historyCursorRef.current;

      const data = await fetchChatHistory({
        token,
        containerId,
        before,
        limit: CHAT_HISTORY_LIMIT,
      });

      const normalized = data.map(normalizeChatMessage);
      const sorted = sortChronologically(normalized);

        setMessages((prev) =>
          options.reset ? sorted : mergeChronologically(prev, sorted)
        );

        if (sorted.length > 0) {
          historyCursorRef.current = sorted[0].createdAt;
        }

        const hasMore = data.length >= 40 && sorted.length > 0;
        hasMoreRef.current = hasMore;
        setHasMoreHistory(hasMore);
      } catch (error) {
        console.error("채팅 히스토리 로딩 실패", error);
      } finally {
        setHistoryLoading(false);
      }
    },
    [containerId, getToken, isSignedIn]
  );

  const loadMoreHistory = () => {
    loadHistory();
  };

  const searchMessages = useCallback(
    async (keyword: string) => {
      if (!keyword.trim() || !containerId || !isSignedIn) {
        return;
      }

      setIsSearching(true);
      try {
        const token = await getToken({ template: "jwt" });
        if (!token) return;

        const results = await searchChatMessages({
          token,
          containerId,
          keyword,
        });
        const normalized = results.map(normalizeChatMessage);
        setMessages(sortChronologically(normalized));
        setSearchActiveState(true);
      } catch (error) {
        console.error("채팅 검색 실패", error);
      } finally {
        setIsSearching(false);
      }
    },
    [containerId, getToken, isSignedIn]
  );

  const clearSearch = useCallback(() => {
    if (!searchActiveRef.current) return;
    setSearchActiveState(false);
    hasMoreRef.current = true;
    loadHistory({ reset: true });
  }, [loadHistory]);

  const sendMessage = () => {
    if (!stompClientRef.current || !input.trim()) return;

    stompClientRef.current.publish({
      destination: `/pub/chat/${containerId}`,
      body: JSON.stringify({
        message: input,
      }),
    });

    setInput("");
  };

  useEffect(() => {
    setMessages([]);
    historyCursorRef.current = null;
    hasMoreRef.current = true;
    loadHistory({ reset: true });
  }, [containerId, loadHistory]);

  return {
    messages,
    input,
    setInput,
    sendMessage,
    loadMoreHistory,
    isHistoryLoading,
    searchMessages,
    clearSearch,
    isSearchActive: searchActive,
    isSearching,
    hasMoreHistory,
  };
}
