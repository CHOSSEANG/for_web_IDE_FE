"use client";

import {
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiReact,
  SiNodedotjs,
  SiNextdotjs,
} from "react-icons/si";

import { Button } from "@/components/ui/button";

export default function NewContainer() {
  return (
    <section className="mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">Create new container</h2>
        <Button
          type="button"
          variant="secondary"
          className="text-xs px-3 py-1.5 rounded-md"
        >
          + New Template
        </Button>
      </div>

      {/* Template Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4">
        {[
          {
            name: "HTML",
            desc: "Static HTML environment",
            icon: <SiHtml5 className="text-orange-500 text-3xl" />,
          },
          {
            name: "CSS",
            desc: "CSS styling playground",
            icon: <SiCss3 className="text-blue-500 text-3xl" />,
          },
          {
            name: "JavaScript",
            desc: "Vanilla JavaScript runtime",
            icon: <SiJavascript className="text-yellow-400 text-3xl" />,
          },
          {
            name: "React",
            desc: "React application template",
            icon: <SiReact className="text-sky-500 text-3xl" />,
          },
          {
            name: "Node.js",
            desc: "Node.js backend environment",
            icon: <SiNodedotjs className="text-green-500 text-3xl" />,
          },
          {
            name: "Next.js",
            desc: "Next.js fullstack framework",
            icon: (
              <SiNextdotjs className="text-neutral-800 dark:text-neutral-200 text-3xl" />
            ),
          },
        ].map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            className="
              rounded-xl bg-slate-200 dark:bg-slate-800
              border border-slate-300 dark:border-slate-700
              p-4
              flex items-center gap-4
            "
          >
            {/* Icon (왼쪽 크게) */}
            <div className="
              flex items-center justify-center
              w-12 h-12
              rounded-lg
            ">
              {item.icon}
            </div>

            {/* Text */}
            <div>
              <p className="text-sm font-semibold leading-tight">
                {item.name}
              </p>
              <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
