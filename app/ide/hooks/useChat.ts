"use client";

import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import { ChatMessage } from "@/app/ide/types/chat";
import { useAuth } from "@clerk/nextjs";

export function useChat(containerId: number) {
  const { getToken, isSignedIn } = useAuth();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const stompClientRef = useRef<Client | null>(null);

  useEffect(() => {
    setMessages([
      {
        userName: "홍길동",
        userImgUrl: "",
        message: "안녕하세요 👋",
        createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      },
      {
        userName: "김프론트",
        userImgUrl: "",
        message: "오 채팅 UI 잘 뜨네요",
        createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
      },
      {
        userName: "박박디라라",
        userImgUrl: "",
        message: "말풍선도 바뀌었어요~!!",
        createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
      },
      {
        userName: "홍길동",
        userImgUrl: "",
        message: "검색도 되는지 확인해봐요",
        createdAt: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
      },
    ]);
  }, []);

  /* ==========================
      STOMP 연결 & 구독
  ========================== */
  useEffect(() => {
    if (!isSignedIn) return;

    let client: Client;

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
          client.subscribe(`/sub/chat/${containerId}`, (frame) => {
            const body: ChatMessage = JSON.parse(frame.body);

            setMessages((prev) =>
              [...prev, body].sort(
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
