"use client";

import { useChat } from "@/app/ide/hooks/useChat";

interface ChatPanelProps {
  containerId: string;
}

export default function ChatPanel({ containerId }: ChatPanelProps) {
  const { messages, input, setInput, sendMessage } = useChat(containerId);

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex-1 overflow-y-auto mb-2">
        {messages.map((m) => (
          <div key={m.id}>
            {m.sender}: {m.content}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="border flex-1 px-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="border px-2" onClick={sendMessage}>
          전송
        </button>
      </div>
    </div>
  );
}
