"use client";

import { useChat } from "@/app/ide/hooks/useChat";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

interface ChatPanelProps {
  containerId: number;
}

export default function ChatPanel({ containerId }: ChatPanelProps) {
  const { messages, input, setInput, sendMessage } = useChat(containerId);

  return (
    <div className="h-full flex flex-col p-4">
      <MessageList messages={messages} />

      <MessageInput
        value={input ?? ""}
        onChange={setInput}
        onSend={sendMessage}
      />
    </div>
  );
}
