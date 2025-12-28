"use client";

import { useEffect, useState, useCallback } from "react";
import ParticipantList from "./ParticipantList";
import InviteUserForm from "./InviteUserForm";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.webicapp.com";

interface Participant {
  userId: number;
  userName: string;
  userImgUrl: string | null;
}

interface InvitePanelProps {
  containerId: number;
}

export default function InvitePanel({ containerId }: InvitePanelProps) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ 참여자 목록 불러오기 (useCallback으로 고정)
  const fetchParticipants = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/container/${containerId}/users`
      );
      if (!res.ok) throw new Error("참여자 조회 실패");

      const data: { userName: string; userImgUrl: string | null }[] =
        await res.json();

      const participantsWithId: Participant[] = data.map((user, idx) => ({
        userId: idx + 1,
        userName: user.userName,
        userImgUrl: user.userImgUrl,
      }));

      setParticipants(participantsWithId);
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [containerId]);

  // ✅ dependency 경고 해결
  useEffect(() => {
    fetchParticipants();
  }, [fetchParticipants]);

  return (
    <div className="h-full flex flex-col p-4">
      <h2 className="text-sm font-semibold mb-3">참여자</h2>

      {loading ? (
        <div className="text-sm text-gray-400">불러오는 중...</div>
      ) : (
        <ParticipantList participants={participants} />
      )}

      <div className="mt-auto">
        <InviteUserForm
          containerId={containerId}
          onInviteSuccess={fetchParticipants} // ✅ 안정적인 참조
        />
      </div>
    </div>
  );
}
