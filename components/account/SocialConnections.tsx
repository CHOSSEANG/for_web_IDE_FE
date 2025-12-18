"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

type ProviderKey = "google" | "github" | "discord";

const providers: { key: ProviderKey; name: string }[] = [
  { key: "google", name: "Google" },
  { key: "github", name: "GitHub" },
  { key: "discord", name: "Discord" },
];

const providerKeySet = new Set<ProviderKey>(providers.map((item) => item.key));

export default function SocialConnections() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [openMenu, setOpenMenu] = useState<ProviderKey | null>(null);
  const [unlinkingProvider, setUnlinkingProvider] = useState<ProviderKey | null>(
    null
  );

  const connectedProviders = new Set<ProviderKey>();
  if (user) {
    for (const account of user.externalAccounts) {
      const providerKey = account.provider as ProviderKey;
      if (providerKeySet.has(providerKey)) {
        connectedProviders.add(providerKey);
      }
    }
  }

  const handleUnlink = async (providerKey: ProviderKey) => {
    if (!isLoaded || !isSignedIn) {
      return;
    }

    setOpenMenu(null);
    setUnlinkingProvider(providerKey);

    try {
      const response = await fetch("/api/clerk/unlink", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: providerKey }),
      });

      const payload = await response
        .json()
        .catch(() => ({} as { message?: string }));

      if (!response.ok) {
        throw new Error(payload.message ?? "연결 해제에 실패했습니다.");
      }

      await user?.reload();
    } catch (error) {
      console.error("Clerk unlink failed", error);
    } finally {
      setUnlinkingProvider((current) =>
        current === providerKey ? null : current
      );
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
          const isUnlinking = unlinkingProvider === provider.key;

          return (
            <li
              key={provider.key}
              className="relative flex items-center justify-between rounded-2xl border border-border-strong bg-bg-raised px-3 py-2 text-sm text-text-primary transition hover:border-blue-500"
            >
              <span className="text-sm font-semibold">{provider.name}</span>

              {isConnected ? (
                <div className="relative flex items-center gap-2 text-xs text-success">
                  <span className="text-xs font-semibold text-success">
                    연결됨
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setOpenMenu(
                        openMenu === provider.key ? null : provider.key
                      )
                    }
                    className="px-1 text-text-muted transition hover:text-text-primary"
                  >
                    …
                  </button>

                  {openMenu === provider.key && (
                    <div className="absolute right-0 top-6 z-10 w-32 rounded-2xl border border-border-strong bg-bg-subtle text-xs">
                      <button
                        type="button"
                        className="w-full px-3 py-2 text-left text-red-400 transition hover:bg-bg-raised disabled:cursor-not-allowed disabled:text-text-muted"
                        disabled={isUnlinking}
                        onClick={() => handleUnlink(provider.key)}
                      >
                        {isUnlinking ? "처리 중…" : "삭제"}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={`/sign-in?strategy=${provider.key}`}
                  className="rounded-2xl bg-blue-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
                >
                  연결하기
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
