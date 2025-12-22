"use client";

import { FiPlay } from "react-icons/fi";
import { FaListUl, FaPlay } from "react-icons/fa";
import { MdOutlineStopCircle } from "react-icons/md";
import { FaRegFolderOpen } from "react-icons/fa6";
import {
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiReact,
  SiNodedotjs,
  SiNextdotjs,
} from "react-icons/si";

import { Button } from "@/components/ui/button";
import Pagination from "@/components/dashboard/Pagination";

export default function ListContainer() {
  // tech → icon 매핑
  const techIconMap: Record<string, JSX.Element> = {
    HTML: <SiHtml5 className="text-orange-500 text-lg" />,
    CSS: <SiCss3 className="text-blue-500 text-lg" />,
    JavaScript: <SiJavascript className="text-yellow-400 text-lg" />,
    React: <SiReact className="text-sky-500 text-lg" />,
    "Node.js": <SiNodedotjs className="text-green-500 text-lg" />,
    "Next.js": (
      <SiNextdotjs className="text-neutral-800 dark:text-neutral-200 text-lg" />
    ),
  };

  return (
    <section>
      {/* ================= Recent Containers ================= */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">Recent Containers</h2>

        <Button
          className="text-xs px-3 py-1.5 flex items-center gap-2"
          variant="secondary"
          type="button"
        >
          <FaListUl className="text-sm" />
          View all
        </Button>
      </div>

      <div className="space-y-2">
        {[
          {
            name: "my-react-app",
            tech: "React",
            time: "2분 전",
            status: "running",
          },
          {
            name: "landing-html",
            tech: "HTML",
            time: "10분 전",
            status: "stopped",
          },
          {
            name: "style-library",
            tech: "CSS",
            time: "30분 전",
            status: "stopped",
          },
          {
            name: "vanilla-js-playground",
            tech: "JavaScript",
            time: "1시간 전",
            status: "stopped",
          },
          {
            name: "api-server",
            tech: "Node.js",
            time: "3시간 전",
            status: "stopped",
          },
          {
            name: "webic-dashboard",
            tech: "Next.js",
            time: "1일 전",
            status: "stopped",
          },
        ].map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-slate-200 dark:bg-slate-800"
          >
            {/* ===== Info (아이콘 + 텍스트) ===== */}
            <div className="flex items-center gap-3">
              {/* 기술 아이콘 */}
              <div className="shrink-0">
                {techIconMap[item.tech] ?? (
                  <FaRegFolderOpen className="text-slate-400 text-lg" />
                )}
              </div>

              {/* 텍스트 */}
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {item.tech} · {item.time}
                </p>
              </div>
            </div>

            {/* ===== Status + Action ===== */}
            <div className="flex items-center gap-3">
              {item.status === "running" ? (
                <span className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-emerald-500/10 text-emerald-500">
                  <FiPlay />
                  실행 중
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-slate-400/10 text-slate-400">
                  <MdOutlineStopCircle />
                  중지됨
                </span>
              )}

              <Button
                type="button"
                variant={item.status === "running" ? "destructive" : "primary"}
                className="text-xs px-3 py-1.5 rounded-md flex items-center gap-1"
              >
                {item.status === "running" ? (
                  <FaRegFolderOpen className="text-sm" />
                ) : (
                  <FaPlay className="text-sm" />
                )}
                <span>{item.status === "running" ? "Open" : "Start"}</span>
                </Button>
              

            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <Pagination currentPage={1} totalPages={99} />
    </section>
  );
}
