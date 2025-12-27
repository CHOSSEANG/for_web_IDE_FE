"use client";

import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import { ChatMessage } from "@/app/ide/types/chat";
import { useAuth } from "@clerk/nextjs";

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

export function useChat(
  containerId: number,
  myUserId: number
): {
  messages: ChatMessage[];
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: () => void;
} {
  const { getToken, isSignedIn } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
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
      const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8080/ws";

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
        userId: myUserId,
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
