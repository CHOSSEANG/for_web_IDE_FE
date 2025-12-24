"use client";

import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import { ChatMessage } from "@/app/ide/types/chat";
import { useAuth } from "@clerk/nextjs";

type RawChatMessage = Partial<ChatMessage> & Record<string, unknown>;

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
} {
  const { getToken, isSignedIn } = useAuth();

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const seedMessages: RawChatMessage[] = [
      {
        userName: "홍길동",
        userImgUrl: "",
        message: "안녕하세요 👋",
        content: "안녕하세요 👋",
        sender: "me",
        createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      },
      {
        userName: "김프론트",
        userImgUrl: "",
        message: "오 채팅 UI 잘 뜨네요",
        content: "오 채팅 UI 잘 뜨네요",
        sender: "other",
        createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
      },
      {
        userName: "박박디라라",
        userImgUrl: "",
        message: "말풍선도 바뀌었어요~!!",
        content: "말풍선도 바뀌었어요~!!",
        sender: "other",
        createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
      },
      {
        userName: "홍길동",
        userImgUrl: "",
        message: "검색도 되는지 확인해봐요",
        content: "검색도 되는지 확인해봐요",
        sender: "me",
        createdAt: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
      },
    ];

    return seedMessages.map(normalizeChatMessage);
  });
  const [input, setInput] = useState("");
  const stompClientRef = useRef<Client | null>(null);

  /* ==========================
      STOMP 연결 & 구독
  ========================== */
  useEffect(() => {
    if (!isSignedIn) return;

    let client: Client | null = null;

    const connect = async () => {
      const token = await getToken({ template: "jwt" });
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

            setMessages((prev) =>
              [...prev, normalized].sort(
                (a, b) =>
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime()
              )
            );
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

  return {
    messages,
    input,
    setInput,
    sendMessage,
  };
}
