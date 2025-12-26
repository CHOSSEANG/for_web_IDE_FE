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
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:8080"
    : "https://api.webicapp.com");

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

type CreateContainerResponse = {
  data?: {
    id?: string;
    containerId?: string;
  };
  id?: string;
  containerId?: string;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function extractContainerId(payload: unknown): string | null {
  if (!isObject(payload)) return null;

  const directId = payload["id"];
  if (typeof directId === "string" && directId.length > 0) return directId;

  const directContainerId = payload["containerId"];
  if (typeof directContainerId === "string" && directContainerId.length > 0)
    return directContainerId;

  const data = payload["data"];
  if (!isObject(data)) return null;

  const dataId = data["id"];
  if (typeof dataId === "string" && dataId.length > 0) return dataId;

  const dataContainerId = data["containerId"];
  if (typeof dataContainerId === "string" && dataContainerId.length > 0)
    return dataContainerId;

  return null;
}

export default function NewTemplateModal({
  open,
  onOpenChange,
  templates,
  initialTemplateId,
}: NewTemplateModalProps) {
  const router = useRouter();

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [containerName, setContainerName] = useState("");
  const [loading, setLoading] = useState(false);

  // Clerk는 DISABLE_AUTH=true여도 훅 자체는 호출돼야 하므로 유지
  const { getToken, isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (open && initialTemplateId) {
      setSelectedTemplate(initialTemplateId);
    }
  }, [initialTemplateId, open]);

  const disabled = !selectedTemplate || containerName.trim().length === 0;

  const handleCreate = async () => {
    if (disabled) {
      alert("템플릿 선택 + 컨테이너 이름 입력이 필요합니다.");
      return;
    }

    // 배포 환경에서는 DISABLE_AUTH=false로 두고 Clerk 토큰을 붙여야 함
    if (!DISABLE_AUTH) {
      if (!isLoaded) {
        alert("인증 모듈(Clerk)이 아직 로딩되지 않았습니다.");
        return;
      }
      if (!isSignedIn) {
        alert("로그인이 필요합니다.");
        return;
      }
    }

    try {
      setLoading(true);

      const name = containerName.trim();
      const lang = selectedTemplate;
      if (!lang) throw new Error("템플릿이 선택되지 않았습니다.");

      const token = DISABLE_AUTH ? null : await getToken();
      if (!DISABLE_AUTH && !token) throw new Error("인증 토큰 없음");

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}/container/create`, {
        method: "POST",
        headers,
        body: JSON.stringify({ name, lang }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(
          `컨테이너 생성 실패 (status ${res.status})${text ? `: ${text}` : ""}`
        );
      }

      const contentType = res.headers.get("content-type") || "";

      let payload: unknown;
      if (contentType.includes("application/json")) {
        // 가능한 응답 타입을 좁히기 위해 unknown으로 받음
        payload = (await res.json()) as CreateContainerResponse;
      } else {
        payload = await res.text();
      }

      const containerId = extractContainerId(payload);
      if (!containerId) throw new Error("containerId 없음");

      onOpenChange(false);
      router.push(`/ide/${containerId}`);
    } catch (e) {
      console.error(e);
      const message =
        e instanceof Error ? e.message : "컨테이너 생성에 실패했습니다.";
      alert(message);
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
            const isSelected = tpl.id === selectedTemplate;
            return (
              <button
                key={tpl.id}
                type="button"
                onClick={() => setSelectedTemplate(tpl.id)}
                className={`
                  p-3 rounded-lg border text-left transition
                  ${
                    isSelected
                      ? "border-indigo-500 bg-indigo-500/10"
                      : "border-slate-300 dark:border-slate-700 hover:border-slate-400"
                  }
                `}
              >
                <div className="mb-2">{tpl.icon}</div>
                <p className="text-sm font-medium">{tpl.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {tpl.desc}
                </p>
              </button>
            );
          })}
        </div>

        <div className="mt-4">
          <label className="text-xs font-medium text-slate-500">
            컨테이너 이름
          </label>
          <input
            type="text"
            placeholder="my-react-app"
            value={containerName}
            onChange={(e) => setContainerName(e.target.value)}
            className="
              mt-1 w-full rounded-md border px-3 py-2 text-sm
              bg-white dark:bg-slate-900
              border-slate-300 dark:border-slate-700
              focus:outline-none focus:ring-2 focus:ring-indigo-500
            "
          />
        </div>

        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
            className="px-5 py-1"
          >
            취소
          </Button>
          <Button
            variant="primary"
            disabled={disabled || loading}
            onClick={handleCreate}
            className="px-5"
          >
            {loading ? "생성 중..." : "생성"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
