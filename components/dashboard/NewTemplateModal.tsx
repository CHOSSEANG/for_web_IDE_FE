"use client";

import { useEffect, useState } from "react";
import type { TemplateWithIcon } from "@/components/dashboard/templateClient";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type NewTemplateModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templates: TemplateWithIcon[];
  initialTemplateId?: string | null;
  onCreate?: (payload: {
    template: TemplateWithIcon;
    name: string;
  }) => Promise<void> | void;
};

export default function NewTemplateModal({
  open,
  onOpenChange,
  templates,
  initialTemplateId,
  onCreate,
}: NewTemplateModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [containerName, setContainerName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (initialTemplateId) {
      setSelectedTemplate(initialTemplateId); // ⭐ 자동 선택
    }
  }, [open, initialTemplateId]);

  const disabled = !selectedTemplate || containerName.trim() === "";

  const handleCreate = async () => {
    if (disabled) return;

    const template = templates.find((t) => t.id === selectedTemplate);
    if (!template) return;

    setLoading(true);
    try {
      await onCreate?.({
        template,
        name: containerName.trim(),
      });
    } finally {
      setLoading(false);
      setSelectedTemplate(null);
      setContainerName("");
      onOpenChange(false);
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
                <p className="text-sm font-medium">{tpl.displayName}</p>
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
            value={containerName}
            onChange={(e) => setContainerName(e.target.value)}
            placeholder="my-container"
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm
              bg-white text-black placeholder:text-slate-400
              border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
