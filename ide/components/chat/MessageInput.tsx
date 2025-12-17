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
    <div className="flex">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1"
      />
      <button onClick={onSend}>전송</button>
    </div>
  );
}
