// @/components/account/SocialConnections.tsx

"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";

type ProviderKey = "google" | "github" | "discord";

const providers: { key: ProviderKey; name: string }[] = [
  { key: "google", name: "Google" },
  { key: "github", name: "GitHub" },
  { key: "discord", name: "Discord" },
];

export default function SocialConnections() {
  const { isLoaded, isSignedIn, user } = useUser();

  const [openMenu, setOpenMenu] = useState<ProviderKey | null>(null);
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
   * 🔗 소셜 계정 추가 연결
   * - 타입 가드 ❌
   * - any ❌
   * - Clerk 정책에 맞춘 UX 처리
   * =============================== */
  const handleConnect = async (provider: ProviderKey) => {
    setProcessing(provider);

    try {
      const externalAccount = await user.createExternalAccount({
        strategy: `oauth_${provider}`,
      });

      const redirectUrl =
        externalAccount.verification?.externalVerificationRedirectURL?.toString();

      if (!redirectUrl) {
        throw new Error("Clerk did not return a redirect URL for the provider.");
      }

      window.location.assign(redirectUrl);
    } catch (error) {
      console.error("OAuth connect blocked by Clerk:", error);
    } finally {
      setProcessing(null);
    }
  };

  /** 🔥 소셜 연결 해제 (백엔드 API 필요) */
  const handleUnlink = async (provider: ProviderKey) => {
    setOpenMenu(null);
    setProcessing(provider);

    try {
      const res = await fetch("/api/clerk/unlink", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider }),
      });

      if (!res.ok) {
        throw new Error("unlink failed");
      }

      await user.reload();
    } catch (error: unknown) {
      console.error("Unlink failed:", error);
      alert("소셜 계정 연결 해제에 실패했습니다.");
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold text-text-primary">
        소셜 로그인 연결
      </h2>

      <ul className="grid grid-cols-1 gap-3">
        {providers.map((provider) => {
          const isConnected = connectedProviders.has(provider.key);
          const isBusy = processing === provider.key;

          return (
            <li
              key={provider.key}
              className="relative flex items-center justify-between  border-t border-border-strong bg-bg-raised p-3 pt-2 pb-0 text-sm"
            >
              <span className="font-semibold">{provider.name}</span>

              {isConnected ? (
                <div className="relative flex items-center gap-2 text-xs text-success">
                  <span className="font-semibold">연결됨</span>

                  <button
                    type="button"
                    onClick={() =>
                      setOpenMenu(
                        openMenu === provider.key ? null : provider.key
                      )
                    }
                    className="px-1 text-text-muted hover:text-text-primary"
                  >
                    …
                  </button>

                  {openMenu === provider.key && (
                    <div className="absolute right-0 top-5 z-10 w-24 bg-bg-subtle p-1">
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleUnlink(provider.key)}
                        className="w-full rounded-lg bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700 disabled:opacity-50"
                      >
                        {isBusy ? "처리 중…" : "삭제"}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => handleConnect(provider.key)}
                  className="rounded-2xl bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
                >
                  {isBusy ? "연결 중…" : "연결하기"}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
