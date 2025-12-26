"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import {
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiReact,
  SiNodedotjs,
  SiNextdotjs,
} from "react-icons/si";

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
    id: "html",
    name: "HTML",
    desc: "Static HTML environment",
    icon: <SiHtml5 className="text-orange-500 text-3xl" />,
  },
  {
    id: "css",
    name: "CSS",
    desc: "CSS styling playground",
    icon: <SiCss3 className="text-blue-500 text-3xl" />,
  },
  {
    id: "js",
    name: "JavaScript",
    desc: "Vanilla JavaScript runtime",
    icon: <SiJavascript className="text-yellow-400 text-3xl" />,
  },
  {
    id: "react",
    name: "React",
    desc: "React application template",
    icon: <SiReact className="text-sky-500 text-3xl" />,
  },
  {
    id: "node",
    name: "Node.js",
    desc: "Node.js backend environment",
    icon: <SiNodedotjs className="text-green-500 text-3xl" />,
  },
  {
    id: "next",
    name: "Next.js",
    desc: "Next.js fullstack framework",
    icon: (
      <SiNextdotjs className="text-neutral-800 dark:text-neutral-200 text-3xl" />
    ),
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
