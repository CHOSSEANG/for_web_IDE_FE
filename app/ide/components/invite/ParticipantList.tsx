"use client";

import ParticipantItem from "./ParticipantItem";
import { Participant } from "@/app/ide/types/participant";

interface ParticipantListProps {
  participants: Participant[];
}

export default function ParticipantList({
  participants,
}: ParticipantListProps) {
  return (
    <div className="flex flex-col">
      {participants.map((user) => (
        <ParticipantItem key={user.userId} user={user} />
      ))}
    </div>
  );
}
