"use client";

import { useEffect, useState, useCallback } from "react";
import ParticipantList from "./ParticipantList";
import InviteUserForm from "./InviteUserForm";
import { Participant } from "@/app/ide/types/participant";
import { useAuth } from "@clerk/nextjs";
import { useWebIC } from "@/app/ide/contexts/WebICContext";
import {
  getContainerUsers,
  inviteUserToContainer,
} from "@/lib/api/container";

export default function InvitePanel() {
  const { containerId } = useWebIC();
  const { getToken, isLoaded } = useAuth();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadParticipants = useCallback(async () => {
    if (!containerId || !isLoaded) return;
    setLoading(true);
    try {
      const token = await getToken({ template: "jwt" });
      if (!token) {
        setFeedback("인증 토큰을 가져올 수 없습니다.");
        return;
      }
      const users = await getContainerUsers({ token, containerId });
      setParticipants(users);
    } catch (error) {
      console.error("참여자 조회 실패", error);
      setFeedback("참여자 목록을 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [containerId, getToken, isLoaded]);

  useEffect(() => {
    loadParticipants();
  }, [loadParticipants]);

  const handleInvite = async (target: string) => {
    if (!containerId || !isLoaded) {
      setFeedback("컨테이너를 확인할 수 없습니다.");
      return;
    }

    try {
      const token = await getToken({ template: "jwt" });
      if (!token) {
        setFeedback("인증 토큰을 가져올 수 없습니다.");
        return;
      }
      await inviteUserToContainer({ token, containerId, target });
      setFeedback("초대 요청을 보냈습니다.");
      await loadParticipants();
    } catch (error) {
      console.error("초대 실패", error);
      setFeedback("초대에 실패했습니다.");
    }
  };

  return (
    <div className="h-full flex flex-col p-4">
      <h2 className="text-sm font-semibold mb-3">참여자</h2>

      {loading ? (
        <p className="text-xs text-muted-foreground">참여자 로딩 중...</p>
      ) : participants.length === 0 ? (
        <p className="text-xs text-muted-foreground">참여자가 없습니다.</p>
      ) : (
        <ParticipantList participants={participants} />
      )}

      {feedback && (
        <p className="text-xs text-blue-400 mt-2">{feedback}</p>
      )}

      <div className="mt-auto">
        <InviteUserForm onInvite={handleInvite} />
      </div>
    </div>
  );
}
