// @/components/account/SocialConnections.tsx

"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";

type ProviderKey = "google" | "github" | "discord";

const providers: { key: ProviderKey; name: string }[] = [
  { key: "google", name: "Google" },
  { key: "github", name: "GitHub" },
  { key: "discord", name: "Discord" },
];

export default function SocialConnections() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [processing, setProcessing] = useState<ProviderKey | null>(null);

  if (!isLoaded || !isSignedIn || !user) return null;

  /** ✅ 현재 연결된 provider 목록 */
  const connectedProviders = new Set<ProviderKey>();
  user.externalAccounts.forEach((account) => {
    if (account.provider === "google") connectedProviders.add("google");
    if (account.provider === "github") connectedProviders.add("github");
    if (account.provider === "discord") connectedProviders.add("discord");
  });

  /** ===============================
   * 🔔 소셜 로그인 안내 (동작 없음)
   * - 팝업만 표시
   * - 확인 후 아무 동작도 하지 않음
   * =============================== */
  const handleInfoOnly = (provider: ProviderKey) => {
    setProcessing(provider);

    window.alert(
      "보안을 위해 현재 로그인된 상태에서는\n" +
        "소셜 계정을 추가로 연결할 수 없습니다.\n\n" +
        "소셜 로그인을 변경하려면\n" +
        "로그아웃 후 다시 로그인해 주세요."
    );

    setProcessing(null);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold text-text-primary">
        소셜 로그인
      </h2>

      <ul className="grid grid-cols-1 gap-3">
        {providers.map((provider) => {
          const isConnected = connectedProviders.has(provider.key);
          const isBusy = processing === provider.key;

          return (
            <li
              key={provider.key}
              className="flex items-center justify-between border-t border-border-strong bg-bg-raised pt-4 text-sm"
            >
              <span className="font-semibold">{provider.name}</span>

              {isConnected ? (
                <span className="text-xs font-semibold text-success">
                  연결됨
                </span>
              ) : (
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => handleInfoOnly(provider.key)}
                  className="rounded-2xl bg-blue-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
                >
                  연결하기
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
