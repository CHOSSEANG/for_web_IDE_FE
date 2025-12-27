"use client";

import type { ReactNode } from "react";
import Link from "next/link";

import { FiPlay, FiSquare } from "react-icons/fi";
import { FaListUl, FaPlay } from "react-icons/fa";
import { FaRegFolderOpen } from "react-icons/fa6";
import { MdMoreHoriz } from "react-icons/md";
import { SiJavascript, SiPython } from "react-icons/si";
import { DiJava } from "react-icons/di";

import { Button } from "@/components/ui/button";
import Pagination from "@/components/dashboard/Pagination";
import type { ContainerItem } from "@/types/container";

type ListContainerProps = {
  containers: ContainerItem[];
};

export default function ListContainer({ containers }: ListContainerProps) {
  const techIconMap: Record<string, ReactNode> = {
    JavaScript: <SiJavascript className="text-yellow-400 text-lg" />,
    Python: <SiPython className="text-blue-400 text-lg" />,
    Java: <DiJava className="text-red-500 text-lg" />,
  };

  const handleEdit = (item: ContainerItem) => {
    console.log("EDIT:", item.name);
  };

  const handleDelete = (item: ContainerItem) => {
    const ok = window.confirm(
      `"${item.name}" 컨테이너를 삭제하시겠습니까?\n삭제 후에는 복구할 수 없습니다.`
    );
    if (!ok) return;

    console.log("DELETE:", item.name);
  };

  return (
    <section>
      {/* Header */}
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

      {/* List */}
      <div className="space-y-2">
        {containers.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-slate-200 dark:bg-slate-800"
          >
            {/* Info */}
            <div className="flex items-center gap-3">
              <div className="shrink-0">
                {techIconMap[item.tech] ?? (
                  <FaRegFolderOpen className="text-slate-400 text-lg" />
                )}
              </div>

              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {item.tech} · {item.time}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {item.status === "running" ? (
                <span className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-emerald-500/10 text-emerald-500">
                  <FiPlay />
                  실행 중
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-slate-400/10 text-slate-400">
                  <FiSquare />
                  중지됨
                </span>
              )}

              <Link href={`/ide/${item.id}`}>
                <Button
                  type="button"
                  variant={
                    item.status === "running" ? "destructive" : "primary"
                  }
                  className="text-xs px-3 py-1.5 flex items-center gap-1"
                >
                  {item.status === "running" ? (
                    <FaRegFolderOpen className="text-sm" />
                  ) : (
                    <FaPlay className="text-sm" />
                  )}
                  {item.status === "running" ? "Open" : "Start"}
                </Button>
              </Link>

              <Button
                type="button"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => {
                  const action = window.prompt(
                    "작업 선택:\n1 = 수정\n2 = 삭제"
                  );
                  if (action === "1") handleEdit(item);
                  if (action === "2") handleDelete(item);
                }}
              >
                <MdMoreHoriz className="text-lg" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Pagination currentPage={1} totalPages={99} />
    </section>
  );
}
