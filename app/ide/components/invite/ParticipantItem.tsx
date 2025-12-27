"use client";

import Image from "next/image";
import { Participant } from "@/app/ide/types/participant";

const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?background=64748b&color=fff&size=40&name=U";

interface ParticipantItemProps {
  user: Participant;
}

export default function ParticipantItem({ user }: ParticipantItemProps) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <Image
        src={user.userImgUrl || DEFAULT_AVATAR}
        alt={user.userName}
        width={32} // Tailwind w-8
        height={32} // Tailwind h-8
        className="rounded-full"
      />
      <span className="text-sm">{user.userName}</span>
    </div>
  );
}
