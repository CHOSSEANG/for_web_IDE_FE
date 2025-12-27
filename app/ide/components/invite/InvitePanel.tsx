"use client";

import { useEffect, useState } from "react";
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
  containerId: number; // 부모 컴포넌트에서 전달
}

export default function InvitePanel({ containerId }: InvitePanelProps) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(false);

  // 참여자 목록 불러오기
  const fetchParticipants = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/container/${containerId}/users`);
      if (!res.ok) throw new Error("참여자 조회 실패");

      const data: { userName: string; userImgUrl: string | null }[] =
        await res.json();

      const participantsWithId = data.map((user, idx) => ({
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
    };

  useEffect(() => {
    fetchParticipants();
  }, [containerId]);

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
          onInviteSuccess={fetchParticipants} // 초대 후 참여자 갱신
        />
      </div>
    </div>
  );
}
