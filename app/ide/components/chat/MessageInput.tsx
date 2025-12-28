"use client";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
}

export default function MessageInput({
  value,
  onChange,
  onSend,
}: MessageInputProps) {
  return (
    <form
      className="flex items-center gap-2 p-2 w-full"
      onSubmit={(e) => {
        e.preventDefault();
        onSend();
      }}
    >
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="메시지 입력"
        className="flex-1 h-10 bg-bg-base border border-border-light text-text-primary px-3 rounded placeholder:text-text-muted text-sm outline-none focus:ring-1 focus:ring-blue-500"
      />
      <button
        onClick={onSend}
        type="submit"
        className="h-10 min-w-[56px] px-4 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 transition flex items-center justify-center whitespace-nowrap"
      >
        전송
      </button>
    </form>
  );
}
