"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { DiJava } from "react-icons/di";
import { SiPython, SiJavascript } from "react-icons/si";

import { Button } from "@/components/ui/button";
import TemplateCard from "@/components/dashboard/TemplateCard";
import NewTemplateModal from "@/components/dashboard/NewTemplateModal";
import {
  TEMPLATE_META,
  type TemplateId,
} from "@/components/dashboard/templateMeta";
import type { TemplateWithIcon } from "@/components/dashboard/templateClient";

import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.webicapp.com";
const DISABLE_AUTH = process.env.NEXT_PUBLIC_DISABLE_AUTH === "true";

const ICON_MAP: Record<TemplateId, ReactNode> = {
  java: <DiJava className="text-red-500 text-3xl" />,
  python: <SiPython className="text-emerald-500 text-3xl" />,
  javascript: <SiJavascript className="text-yellow-400 text-3xl" />,
};

const TEMPLATES: TemplateWithIcon[] = TEMPLATE_META.map((tpl) => ({
  id: tpl.id,
  displayName: tpl.displayName,
  desc: tpl.desc,
  icon: ICON_MAP[tpl.id],
}));

export default function NewContainer() {
  const [open, setOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] =
    useState<TemplateId | null>(null);

  const router = useRouter();
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const handleCreate = async ({
    template,
    name,
  }: {
    template: TemplateWithIcon;
    name: string;
  }) => {
    if (!DISABLE_AUTH) {
      if (!isLoaded) throw new Error("인증 로딩 중");
      if (!isSignedIn) throw new Error("로그인 필요");
    }

    const token = DISABLE_AUTH ? null : await getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/container/create`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name,
        lang: template.id,
      }),
    });

    if (!res.ok) throw new Error("컨테이너 생성 실패");

    const json = await res.json();
    const containerId = json?.data?.id ?? json?.data?.containerId ?? json?.id;

    if (!containerId) throw new Error("containerId 없음");

    router.push(`/ide/${containerId}`);
  };

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">Create new container</h2>
        <Button
          variant="secondary"
          className="text-xs px-3 py-1.5"
          onClick={() => {
            setSelectedTemplateId(null);
            setOpen(true);
          }}
        >
          + New Template
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {TEMPLATES.map((item) => (
          <TemplateCard
            key={item.id}
            icon={item.icon}
            name={item.displayName}
            desc={item.desc}
            onClick={() => {
              setSelectedTemplateId(item.id); // ⭐ 핵심
              setOpen(true);
            }}
          />
        ))}
      </div>

      <NewTemplateModal
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setSelectedTemplateId(null);
        }}
        templates={TEMPLATES}
        initialTemplateId={selectedTemplateId} // ⭐ 핵심
        onCreate={handleCreate}
      />
    </section>
  );
}
