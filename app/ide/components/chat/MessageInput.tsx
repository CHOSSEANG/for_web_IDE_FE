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
      className="flex gap-2 p-2 w-full"
      onSubmit={(e) => {
        e.preventDefault();
        onSend();
      }}
    >
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="메시지 입력"
        className="flex-1 bg-white text-black px-2 py-1 rounded placeholder:text-gray-400"
      />
      <button
        type="submit"
        className="px-3 py-2 rounded-md border border-white/20"
      >
        전송
      </button>
    </form>
  );
}
