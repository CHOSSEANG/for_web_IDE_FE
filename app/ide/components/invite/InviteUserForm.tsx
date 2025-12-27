"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.webicapp.com";

interface InviteUserFormProps {
  containerId: number;
  onInviteSuccess?: () => void;
}

export default function InviteUserForm({
  containerId,
  onInviteSuccess,
}: InviteUserFormProps) {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();

  const handleInvite = async () => {
    if (!inputValue) return;
    setLoading(true);

    try {
      const token = await getToken({ template: "jwt" });
      const userIds = inputValue
        .split(",")
        .map((id) => id.trim())
        .filter((id) => id.length > 0);

      const res = await fetch(`${API_BASE}/container/${containerId}/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userIds }),
      });

      if (!res.ok) throw new Error("초대 실패");

      const data = await res.json();
      alert(data.data || "초대가 완료되었습니다.");
      setInputValue("");

      // 초대 성공 후 참여자 목록 갱신
      onInviteSuccess?.();
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <input
        placeholder="사용자 ID (콤마로 구분)"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full px-2 py-1 rounded bg-bg-base border border-border-light text-sm text-text-primary placeholder:text-text-muted"
      />
      <button
        onClick={handleInvite}
        disabled={loading}
        className="mt-2 w-full py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-sm transition-colors"
      >
        {loading ? "초대중…" : "초대하기"}
      </button>
    </div>
  );
}
