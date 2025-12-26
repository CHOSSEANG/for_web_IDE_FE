interface InviteUserFormProps {
  onInvite: (identifier: string) => Promise<void>;
}

import { FormEvent, useState } from "react";

export default function InviteUserForm({ onInvite }: InviteUserFormProps) {
  const [input, setInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    setIsSubmitting(true);
    setMessage(null);
    try {
      await onInvite(input.trim());
      setMessage("초대 요청을 보냈습니다.");
      setInput("");
    } catch (error) {
      console.error("초대 처리 실패", error);
      setMessage("초대 요청에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="mt-4" onSubmit={handleSubmit}>
      <input
        placeholder="사용자 이름 또는 ID"
        className="w-full px-2 py-1 rounded bg-[#0E1325] border border-white/10 text-sm"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 w-full py-1 rounded bg-indigo-500 text-sm disabled:opacity-60"
      >
        {isSubmitting ? "전송 중..." : "초대하기"}
      </button>
      {message && (
        <p className="text-xs text-muted-foreground mt-1">{message}</p>
      )}
    </form>
  );
}
