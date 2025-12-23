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
        className="flex-1 h-10 bg-white text-black px-3 rounded placeholder:text-gray-400 text-sm"
      />
      <button
        onClick={onSend}
        type="submit"
        className="h-10 min-w-[56px] px-4 rounded-md bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 transition flex items-center justify-center whitespace-nowrap"
      >
        전송
      </button>
    </form>
  );
}
