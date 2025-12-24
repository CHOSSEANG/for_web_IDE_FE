"use client";

import { useState } from "react";

export interface ChatMessage {
  id: number;
  content: string;
  sender: "me" | "other";
}

export function useChat(containerId: string) {
  void containerId;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        content: input,
        sender: "me",
      },
    ]);

    setInput("");
  };

  return {
    messages,
    input,
    setInput,
    sendMessage,
  };
}
