"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
};

export default function NewTemplateModal({
  open,
  onOpenChange,
  templates,
}: NewTemplateModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [containerName, setContainerName] = useState("");
  const [loading, setLoading] = useState(false);

  const disabled = !selectedTemplate || !containerName;

  const handleCreate = () => {
    setLoading(true);

    // ❗ mock
    console.log({
      template: selectedTemplate,
      name: containerName,
    });

    setTimeout(() => {
      setLoading(false);
      setSelectedTemplate(null);
      setContainerName("");
      onOpenChange(false);
    }, 1000);
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

        {/* ===== Template Select ===== */}
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

        {/* ===== Container Name ===== */}
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

        {/* ===== Actions ===== */}
        <div className="flex justify-center gap-2 mt-6">
          <Button variant="secondary" onClick={() => onOpenChange(false)}
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
