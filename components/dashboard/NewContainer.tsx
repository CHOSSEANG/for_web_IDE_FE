"use client";

import { FiCode } from "react-icons/fi";
import {
  SiNodedotjs,
  SiReact,
  SiPython,
  SiDocker,
  SiPostgresql,
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
      <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {[
          {
            name: "Node.js",
            desc: "Node.js development environment",
            icon: <SiNodedotjs className="text-green-500 text-lg" />,
          },
          {
            name: "React",
            desc: "React application template",
            icon: <SiReact className="text-sky-500 text-lg" />,
          },
          {
            name: "Python",
            desc: "Python development setup",
            icon: <SiPython className="text-yellow-400 text-lg" />,
          },
          {
            name: "Docker",
            desc: "Custom Docker container",
            icon: <SiDocker className="text-blue-500 text-lg" />,
          },
          {
            name: "Database",
            desc: "PostgreSQL + MySQL",
            icon: <SiPostgresql className="text-indigo-400 text-lg" />,
          },
          {
            name: "Full Stack",
            desc: "Complete web application",
            icon: <FiCode className="text-indigo-500 text-lg" />,
          },
        ].map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            className="
              rounded-xl bg-slate-200/60 dark:bg-slate-800
              border border-slate-300 dark:border-slate-700
              p-3 sm:p-4
              flex items-center gap-2
              sm:flex-col sm:items-start
            "
          >
            {/* Icon */}
            <div className="shrink-0">{item.icon}</div>

            {/* Text */}
            <div>
              <p className="text-sm font-medium leading-tight">
                {item.name}
              </p>
              {/* hidden on mobile */}
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
