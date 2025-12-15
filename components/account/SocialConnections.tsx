"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

type ProviderKey = "google" | "github" | "discord" | "notion";

const providers: { key: ProviderKey; name: string }[] = [
  { key: "google", name: "Google" },
  { key: "github", name: "GitHub" },
  { key: "discord", name: "Discord" },
  { key: "notion", name: "Notion" },
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
    <div className="rounded-2xl bg-[#2A3142] p-4">
      <h2 className="mb-3 text-base font-semibold">소셜 로그인 연결</h2>

      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {providers.map((provider) => {
          const isConnected = connectedProviders.has(provider.key);
          const isUnlinking = unlinkingProvider === provider.key;

          return (
            <li
              key={provider.key}
              className="relative flex items-center justify-between rounded-lg bg-[#3A4152] px-3 py-2"
            >
              <span className="text-sm">{provider.name}</span>

              {isConnected ? (
                <div className="relative flex items-center gap-1">
                  <span className="text-xs text-green-400">연결됨</span>

                  <button
                    type="button"
                    onClick={() =>
                      setOpenMenu(
                        openMenu === provider.key ? null : provider.key
                      )
                    }
                    className="px-1 text-gray-400 hover:text-white"
                  >
                    …
                  </button>

                  {openMenu === provider.key && (
                    <div className="absolute right-0 top-6 z-10 w-24 rounded-md bg-[#1F2533] shadow-lg">
                      <button
                        type="button"
                        className="w-full px-3 py-2 text-xs text-red-400 hover:bg-[#2A3142] disabled:cursor-not-allowed disabled:text-gray-500"
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
                  className="rounded-md bg-indigo-600 px-2 py-1 text-xs hover:bg-indigo-900"
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
