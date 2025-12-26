"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { SiJavascript, SiPython } from "react-icons/si";
import { DiJava } from "react-icons/di";

import { Button } from "@/components/ui/button";
import TemplateCard from "@/components/dashboard/TemplateCard";
import NewTemplateModal from "@/components/dashboard/NewTemplateModal";

type Template = {
  id: string;
  name: string;
  desc: string;
  icon: ReactNode;
};

const TEMPLATES: Template[] = [
  {
    id: "js",
    name: "JavaScript",
    desc: "Vanilla JavaScript runtime",
    icon: <SiJavascript className="text-yellow-400 text-3xl" />,
  },
  {
    id: "python",
    name: "Python",
    desc: "Python runtime",
    icon: <SiPython className="text-blue-400 text-3xl" />,
  },
  {
    id: "java",
    name: "Java",
    desc: "Java runtime",
    icon: <DiJava className="text-red-500 text-3xl" />,
  },
];

export default function NewContainer() {
  const [open, setOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null
  );

  const openWithTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setOpen(true);
  };

  return (
    <section className="mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">Create new container</h2>
        <Button
          type="button"
          variant="secondary"
          className="text-xs px-3 py-1.5 rounded-md"
          onClick={() => {
            setSelectedTemplateId(null);
            setOpen(true);
          }}
        >
          + New Template
        </Button>
      </div>

      {/* Template Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {TEMPLATES.map((item) => (
          <TemplateCard
            key={item.id}
            icon={item.icon}
            name={item.name}
            desc={item.desc}
            onClick={() => openWithTemplate(item.id)}
          />
        ))}
      </div>

      {/* Modal */}
      <NewTemplateModal
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setSelectedTemplateId(null);
        }}
        templates={TEMPLATES}
        initialTemplateId={selectedTemplateId}
      />
    </section>
  );
}
