"use client";

import ParticipantList from "./ParticipantList";
import InviteUserForm from "./InviteUserForm";

export default function InvitePanel() {
  const participants = [
    { userId: 1, userName: "홍길동", userImgUrl: null },
    { userId: 2, userName: "김프론트", userImgUrl: null },
    { userId: 3, userName: "박박디라라", userImgUrl: null },
  ];

  return (
    <div className="h-full flex flex-col p-4">
      <h2 className="text-sm font-semibold mb-3">참여자</h2>

      <ParticipantList participants={participants} />

      <div className="mt-auto">
        <InviteUserForm />
      </div>
    </div>
  );
}
