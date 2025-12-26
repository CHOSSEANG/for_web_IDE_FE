"use client";

import { useCallback, useEffect, useState } from "react";
import ParticipantList from "./ParticipantList";
import InviteUserForm from "./InviteUserForm";
import { Participant } from "@/app/ide/types/participant";
import { useAuth } from "@clerk/nextjs";
import { useWebIC } from "@/app/ide/contexts/WebICContext";
import {
  getContainerUsers,
  inviteUserToContainer,
  fetchContainerInvites,
  acceptInviteRequest,
  declineInviteRequest,
  ContainerInvite,
} from "@/lib/api/container";

export default function InvitePanel() {
  const { containerId } = useWebIC();
  const { getToken, isLoaded } = useAuth();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [participantsLoading, setParticipantsLoading] = useState(false);
  const [invites, setInvites] = useState<ContainerInvite[]>([]);
  const [isInvitesLoading, setIsInvitesLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);

  const loadParticipants = useCallback(async () => {
    if (!containerId || !isLoaded) return;
    setParticipantsLoading(true);
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
      setParticipantsLoading(false);
    }
  }, [containerId, getToken, isLoaded]);

  const loadInvites = useCallback(async () => {
    if (!isLoaded || !containerId) return;
    setIsInvitesLoading(true);
    setInviteError(null);
    try {
      const token = await getToken({ template: "jwt" });
      if (!token) {
        setInviteError("인증 토큰을 가져올 수 없습니다.");
        return;
      }
      const data = await fetchContainerInvites({ token, containerId });
      setInvites(data);
    } catch (error) {
      console.error("초대 목록 조회 실패", error);
      setInviteError("받은 초대를 불러오는 데 실패했습니다.");
    } finally {
      setIsInvitesLoading(false);
    }
  }, [containerId, getToken, isLoaded]);

  useEffect(() => {
    loadParticipants();
    loadInvites();
  }, [loadParticipants, loadInvites]);

  const handleInvite = useCallback(
    async (target: string) => {
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
        await loadInvites();
      } catch (error) {
        console.error("초대 실패", error);
        setFeedback("초대에 실패했습니다.");
      }
    },
    [containerId, getToken, isLoaded, loadParticipants, loadInvites]
  );

  const handleAcceptInvite = useCallback(
    async (inviteId: number) => {
      if (!isLoaded) return;
      try {
        const token = await getToken({ template: "jwt" });
        if (!token) {
          setInviteError("인증 토큰을 가져올 수 없습니다.");
          return;
        }
        await acceptInviteRequest({ token, inviteId });
        setInvites((prev) => prev.filter((invite) => invite.inviteId !== inviteId));
        await loadParticipants();
      } catch (error) {
        console.error("초대 수락 실패", error);
        setInviteError("초대를 수락하지 못했습니다.");
      }
    },
    [getToken, isLoaded, loadParticipants]
  );

  const handleDeclineInvite = useCallback(
    async (inviteId: number) => {
      if (!isLoaded) return;
      try {
        const token = await getToken({ template: "jwt" });
        if (!token) {
          setInviteError("인증 토큰을 가져올 수 없습니다.");
          return;
        }
        await declineInviteRequest({ token, inviteId });
        setInvites((prev) => prev.filter((invite) => invite.inviteId !== inviteId));
      } catch (error) {
        console.error("초대 거절 실패", error);
        setInviteError("초대를 거절하지 못했습니다.");
      }
    },
    [getToken, isLoaded]
  );

  const pendingInvites = invites.filter((invite) => invite.status === "PENDING");

  return (
    <div className="h-full flex flex-col p-4">
      <h2 className="text-sm font-semibold mb-3">참여자</h2>

      {participantsLoading ? (
        <p className="text-xs text-muted-foreground">참여자 로딩 중...</p>
      ) : participants.length === 0 ? (
        <p className="text-xs text-muted-foreground">참여자가 없습니다.</p>
      ) : (
        <ParticipantList participants={participants} />
      )}

      <div className="mt-4 space-y-2">
        <h3 className="text-xs font-semibold text-muted-foreground">
          받은 초대
        </h3>
        {isInvitesLoading ? (
          <p className="text-xs text-muted-foreground">초대 로딩 중...</p>
        ) : inviteError ? (
          <p className="text-xs text-red-400">{inviteError}</p>
        ) : pendingInvites.length === 0 ? (
          <p className="text-xs text-muted-foreground">받은 초대가 없습니다.</p>
        ) : (
          pendingInvites.map((invite) => (
            <div
              key={invite.inviteId}
              className="flex items-center justify-between rounded border border-white/10 px-3 py-2 text-xs"
            >
              <div className="text-sm">
                <p className="font-semibold">{invite.inviterName || "초대자"}</p>
                <p className="text-muted-foreground">
                  {invite.status} ·{" "}
                  {invite.createdAt
                    ? new Date(invite.createdAt).toLocaleString()
                    : "알 수 없음"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAcceptInvite(invite.inviteId)}
                  className="px-2 py-1 rounded bg-green-500 text-[11px]"
                >
                  수락
                </button>
                <button
                  onClick={() => handleDeclineInvite(invite.inviteId)}
                  className="px-2 py-1 rounded bg-red-500 text-[11px]"
                >
                  거절
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {feedback && (
        <p className="text-xs text-blue-400 mt-2">{feedback}</p>
      )}

      <div className="mt-auto">
        <InviteUserForm onInvite={handleInvite} />
      </div>
    </div>
  );
}
