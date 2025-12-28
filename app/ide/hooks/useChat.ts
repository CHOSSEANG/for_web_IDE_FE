"use client";

import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import { ChatMessage } from "@/app/ide/types/chat";
import { useAuth } from "@clerk/nextjs";

/* ==========================
   Utils
========================== */

type RawChatMessage = Partial<ChatMessage> & Record<string, unknown>;

function normalizeChatMessage(raw: RawChatMessage): ChatMessage {
  return {
    userId: Number(raw.userId),
    userName: String(raw.userName ?? "알 수 없음"),
    userImgUrl: String(raw.userImgUrl ?? ""),
    message: String(raw.message ?? ""),
    createdAt:
      typeof raw.createdAt === "string"
        ? raw.createdAt
        : new Date().toISOString(),
  };
}

/** 서버 messageId가 없어서 임시로 쓰는 dedup key */
function messageKey(m: ChatMessage & { _clientId?: string }) {
  return m._clientId ?? `${m.userId}|${m.createdAt}|${m.message}`;
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.webicapp.com";

/* ==========================
   Hook
========================== */

export function useChat(containerId: number, myUserId: number) {
  const { getToken, isSignedIn } = useAuth();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [searchResults, setSearchResults] = useState<ChatMessage[]>([]);

  const [input, setInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const stompClientRef = useRef<Client | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const isFetchingOlderRef = useRef(false);

  /* ==========================
     공통 fetch (auth 포함)
  ========================== */
  const authFetch = async (url: string, signal?: AbortSignal) => {
    if (process.env.NEXT_PUBLIC_DISABLE_AUTH === "true") {
      return fetch(url, { signal });
    }

    const token = await getToken({ template: "jwt" });
    return fetch(url, {
      signal,
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  /* ==========================
     메시지 병합 (중복 방지 핵심)
  ========================== */
  const appendMessages = (incoming: ChatMessage[]) => {
    setMessages((prev) => {
      const map = new Map(prev.map((m) => [messageKey(m), m]));
      for (const m of incoming) {
        map.set(messageKey(m), m);
      }
      return Array.from(map.values()).sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    });
  };

  /* 검색 결과 정렬 (중복 방지) */
  const normalizeAndSort = (data: ChatMessage[]) => {
    const map = new Map<string, ChatMessage>();
    data.forEach((m) => {
      map.set(messageKey(m), m);
    });
    return Array.from(map.values()).sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  };

  /* ==========================
     1️⃣ 초기 채팅 조회
  ========================== */
  const fetchInitialChats = async () => {
    if (!isSignedIn) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await authFetch(
        `${API_BASE}/chat?containerId=${containerId}`,
        controller.signal
      );
      const data = (await res.json()) as ChatMessage[];
      appendMessages(data);
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        console.error("fetchInitialChats failed", e);
      }
    }
  };

  /* ==========================
     2️⃣ 과거 채팅 페이징
  ========================== */
  const fetchOlderChats = async () => {
    if (isSearching || isFetchingOlderRef.current) return;
    if (messages.length === 0) return;

    isFetchingOlderRef.current = true;

    try {
      const oldest = messages.reduce(
        (min, m) => (m.createdAt < min ? m.createdAt : min),
        messages[0].createdAt
      );
      const res = await authFetch(
        `${API_BASE}/chat?containerId=${containerId}&lastCreatedAt=${encodeURIComponent(
          oldest
        )}`
      );
      const data = (await res.json()) as ChatMessage[];
      appendMessages(data);
    } catch (e) {
      console.error("fetchOlderChats failed", e);
    } finally {
      isFetchingOlderRef.current = false;
    }
  };

  /* ==========================
     3️⃣ 채팅 검색
  ========================== */
  const isSearchingRef = useRef(false);
  const searchChats = async (keyword: string) => {
    abortRef.current?.abort();

    if (!keyword.trim()) {
      setIsSearching(false);
      isSearchingRef.current = false;
      setSearchResults([]);
      fetchInitialChats();
      return;
    }

    setIsSearching(true);
    isSearchingRef.current = true;
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await authFetch(
        `${API_BASE}/chat/search?containerId=${containerId}&keyword=${encodeURIComponent(
          keyword
        )}`,
        controller.signal
      );
      const data = (await res.json()) as ChatMessage[];
      setSearchResults(normalizeAndSort(data));
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        console.error("searchChats failed", e);
      }
    }
  };

  /* ==========================
     4️⃣ STOMP 연결 (검색과 무관하게 유지)
  ========================== */
  useEffect(() => {
    if (!isSignedIn) return;

    let client: Client;

    const connect = async () => {
      const token = await getToken({ template: "jwt" });
      const WS_URL =
        process.env.NEXT_PUBLIC_WS_URL ?? "wss://www.webicapp.com/ws";

      client = new Client({
        brokerURL: WS_URL,
        connectHeaders:
          process.env.NEXT_PUBLIC_DISABLE_AUTH === "true"
            ? {}
            : { Authorization: `Bearer ${token}` },
        reconnectDelay: 5000,
        onConnect: () => {
          client.subscribe(`/sub/chat/${containerId}`, (frame) => {
            const raw = JSON.parse(frame.body) as RawChatMessage;
            const msg = normalizeChatMessage(raw);

            // 🔴 내가 보낸 건 optimistic update로 이미 있음
            if (msg.userId === myUserId) return;

            // 🔴 검색 중이면 실시간 반영 X
            if (isSearchingRef.current) return;

            appendMessages([msg]);
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
  }, [containerId, getToken, isSignedIn, myUserId]);

  /* ==========================
     5️⃣ 메시지 전송 (optimistic)
  ========================== */
  const sendMessage = () => {
    if (!stompClientRef.current || !input.trim()) return;

    const optimistic: ChatMessage & { _clientId: string } = {
      _clientId: crypto.randomUUID(),
      userId: myUserId,
      userName: "나",
      userImgUrl: "",
      message: input,
      createdAt: new Date().toISOString(),
    };

    appendMessages([optimistic]);

    stompClientRef.current.publish({
      destination: `/pub/chat/${containerId}`,
      body: JSON.stringify({ message: input }),
    });

    setInput("");
  };

  /* ==========================
     containerId 변경 시 초기화
  ========================== */
  useEffect(() => {
    setMessages([]);
    setSearchResults([]);
    setIsSearching(false);
    isSearchingRef.current = false;
  }, [containerId]);

  return {
    messages,
    searchResults,
    input,
    setInput,
    sendMessage,
    fetchInitialChats,
    fetchOlderChats,
    searchChats,
  };
}
