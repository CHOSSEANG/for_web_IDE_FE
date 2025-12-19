// @/components/account/SocialConnections.tsx


"use client";

import { useState } from "react";
import { useUser, useSignIn } from "@clerk/nextjs";

type ProviderKey = "google" | "github" | "discord";

const providers: { key: ProviderKey; name: string }[] = [
  { key: "google", name: "Google" },
  { key: "github", name: "GitHub" },
  { key: "discord", name: "Discord" },
];

export default function SocialConnections() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signIn, isLoaded: signInLoaded } = useSignIn();

  const [openMenu, setOpenMenu] = useState<ProviderKey | null>(null);
  const [unlinking, setUnlinking] = useState<ProviderKey | null>(null);

  if (!isLoaded || !isSignedIn || !user) return null;

  /** 🔥 Clerk 실제 provider 기준으로 연결 여부 판단 */
  const connectedProviders = new Set<ProviderKey>();
  user.externalAccounts.forEach((account) => {
    if (account.provider === "google") connectedProviders.add("google");
    if (account.provider === "github") connectedProviders.add("github");
    if (account.provider === "discord") connectedProviders.add("discord");
  });

  const handleConnect = async (provider: ProviderKey) => {
    if (!signInLoaded) return;

    try {
      await signIn.authenticateWithRedirect({
        strategy: `oauth_${provider}`,
        redirectUrl: "/auth/callback",
        redirectUrlComplete: "/main",
      });
    } catch (error) {
      console.error("OAuth connect failed:", error);
      alert("소셜 계정 연결에 실패했습니다.");
    }
  };

  const handleUnlink = async (provider: ProviderKey) => {
    setOpenMenu(null);
    setUnlinking(provider);

    try {
      const res = await fetch("/api/clerk/unlink", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      /** ⭐️ 반드시 reload */
      await user.reload();
    } catch (error) {
      console.error("Unlink failed:", error);
      alert("소셜 계정 연결 해제에 실패했습니다.");
    } finally {
      setUnlinking(null);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold text-text-primary">
        소셜 로그인 연결
      </h2>

      <ul className="grid grid-cols-2 gap-3">
        {providers.map((provider) => {
          const isConnected = connectedProviders.has(provider.key);
          const isProcessing = unlinking === provider.key;

          return (
            <li
              key={provider.key}
              className="relative flex items-center justify-between rounded-2xl border border-border-strong bg-bg-raised px-3 py-2 text-sm"
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
                    <div className="absolute right-0 top-5 z-10 w-24 rounded-xl bg-bg-subtle p-1">
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => handleUnlink(provider.key)}
                        className="w-full rounded-lg bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700 disabled:opacity-50"
                      >
                        {isProcessing ? "처리 중…" : "삭제"}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  disabled={!signInLoaded}
                  onClick={() => handleConnect(provider.key)}
                  className="rounded-2xl bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
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
