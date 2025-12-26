"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.webicapp.com";

const DISABLE_AUTH = process.env.NEXT_PUBLIC_DISABLE_AUTH === "true";

type Template = {
  id: string;
  name: string;
  desc: string;
  icon: ReactNode;
};

type NewTemplateModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templates: Template[];
  initialTemplateId?: string | null;
};

export default function NewTemplateModal({
  open,
  onOpenChange,
  templates,
  initialTemplateId,
}: NewTemplateModalProps) {
  const router = useRouter();
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [containerName, setContainerName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && initialTemplateId) {
      setSelectedTemplate(initialTemplateId);
    }
  }, [open, initialTemplateId]);

  const disabled = !selectedTemplate || containerName.trim() === "";

  const handleCreate = async () => {
    if (disabled) {
      alert("템플릿 선택 + 컨테이너 이름 입력이 필요합니다.");
      return;
    }

    if (!DISABLE_AUTH) {
      if (!isLoaded) return alert("인증 로딩 중입니다.");
      if (!isSignedIn) return alert("로그인이 필요합니다.");
    }

    try {
      setLoading(true);

      const token = DISABLE_AUTH ? null : await getToken();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}/container/create`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: containerName.trim(),
          lang: selectedTemplate,
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`컨테이너 생성 실패 (${res.status}) ${text}`);
      }

      const json = await res.json();

      const containerId =
        json?.data?.id ??
        json?.data?.containerId ??
        json?.id ??
        json?.containerId;

      if (!containerId) {
        throw new Error("containerId가 응답에 없습니다.");
      }

      onOpenChange(false);
      router.push(`/ide/${containerId}`);
    } catch (err) {
      console.error(err);
      alert(
        err instanceof Error
          ? err.message
          : "컨테이너 생성 중 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>새 컨테이너 생성</DialogTitle>
          <DialogDescription>
            시작할 템플릿을 선택하고 이름을 입력하세요
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 mt-4">
          {templates.map((tpl) => {
            const selected = tpl.id === selectedTemplate;
            return (
              <button
                key={tpl.id}
                type="button"
                onClick={() => setSelectedTemplate(tpl.id)}
                className={`p-3 rounded-lg border text-left ${
                  selected
                    ? "border-indigo-500 bg-indigo-500/10"
                    : "border-slate-300 hover:border-slate-400"
                }`}
              >
                <div className="mb-2">{tpl.icon}</div>
                <p className="text-sm font-medium">{tpl.name}</p>
                <p className="text-xs text-slate-500">{tpl.desc}</p>
              </button>
            );
          })}
        </div>

        <div className="mt-4">
          <label className="text-xs font-medium text-slate-500">
            컨테이너 이름
          </label>
          <input
            value={containerName}
            onChange={(e) => setContainerName(e.target.value)}
            placeholder="my-container"
            className={
              "mt-1 w-full rounded-md border px-3 py-2 text-sm\n" +
              "bg-white dark:bg-white\n" +
              "text-black placeholder:text-slate-400\n" +
              "border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            }
          />
        </div>

        <div className="flex justify-center gap-2 mt-6">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button
            variant="primary"
            onClick={handleCreate}
            disabled={disabled || loading}
          >
            {loading ? "생성 중..." : "생성"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
