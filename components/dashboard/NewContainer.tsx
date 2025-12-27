"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { DiJava } from "react-icons/di";
import { SiPython, SiJavascript } from "react-icons/si";

import { Button } from "@/components/ui/button";
import TemplateCard from "@/components/dashboard/TemplateCard";
import NewTemplateModal from "@/components/dashboard/NewTemplateModal";
import { TEMPLATE_META, type TemplateId } from "@/components/dashboard/templateMeta";
import type { TemplateWithIcon } from "@/components/dashboard/templateClient";

const ICON_MAP: Record<TemplateId, ReactNode> = {
  java: <DiJava className="text-red-500 text-3xl" />,
  python: <SiPython className="text-emerald-500 text-3xl" />,
  javascript: <SiJavascript className="text-yellow-400 text-3xl" />,
};

const TEMPLATES: TemplateWithIcon[] = TEMPLATE_META.map((template) => ({
  ...template,
  name: template.id,
  icon: ICON_MAP[template.id],
}));

type NewContainerProps = {
  onCreate?: (payload: { template: TemplateWithIcon; name: string }) => Promise<void> | void;
};

export default function NewContainer({ onCreate }: NewContainerProps) {
  const [open, setOpen] = useState(false);

  return (
    <section className="mb-8">
      {/* ===== Header ===== */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">Create new container</h2>
        <Button
          type="button"
          variant="secondary"
          className="text-xs px-3 py-1.5 rounded-md"
          onClick={() => setOpen(true)}
        >
          + New Template
        </Button>
      </div>

      {/* ===== Template Preview ===== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {TEMPLATES.map((item) => (
          <TemplateCard
            key={item.id}
            icon={item.icon}
            name={item.displayName}
            desc={item.desc}
          />
        ))}
      </div>

      {/* ===== Modal ===== */}
      <NewTemplateModal
        open={open}
        onOpenChange={setOpen}
        templates={TEMPLATES}
        onCreate={onCreate}
      />
    </section>
  );
}
