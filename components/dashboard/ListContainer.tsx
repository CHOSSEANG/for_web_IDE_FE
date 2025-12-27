"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";

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
  onRename: (id: number, name: string) => Promise<void>;
  onLeave: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

export default function ListContainer({
  containers,
  onRename,
  onLeave,
  onDelete,
}: ListContainerProps) {
  const techIconMap: Record<string, ReactNode> = {
    JavaScript: <SiJavascript className="text-yellow-400 text-lg" />,
    Python: <SiPython className="text-blue-400 text-lg" />,
    Java: <DiJava className="text-red-500 text-lg" />,
  };

  const [openModalId, setOpenModalId] = useState<number | null>(null);
  const [editModalId, setEditModalId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const modalRef = useRef<HTMLDivElement | null>(null);

  const toggleModal = (id: number) =>
    setOpenModalId(prev => (prev === id ? null : id));

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setOpenModalId(null);
        setEditModalId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const startEdit = (item: ContainerItem) => {
    setEditName(item.name);
    setEditModalId(item.id);
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">Recent Containers</h2>
        <Button variant="secondary" className="text-xs px-3 py-1.5 flex gap-2">
          <FaListUl /> View all
        </Button>
      </div>

      <div className="space-y-2">
        {containers.length > 0 ? (
          containers.map(item => (
            <div
              key={item.id}
              className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-slate-200 dark:bg-slate-800 relative"
            >
              <div className="flex items-center gap-3">
                {techIconMap[item.tech] ?? (
                  <FaRegFolderOpen className="text-slate-400 text-lg" />
                )}
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-slate-500">
                    {item.tech} · {item.time}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 relative">
                {item.status === "running" ? (
                  <span className="text-xs px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 flex gap-1">
                    <FiPlay /> 실행 중
                  </span>
                ) : (
                  <span className="text-xs px-2 py-1 rounded bg-slate-400/10 text-slate-400 flex gap-1">
                    <FiSquare /> 중지됨
                  </span>
                )}

                <Link href={`/ide/${item.id}`}>
                  <Button
                    variant={item.status === "running" ? "destructive" : "primary"}
                    className="text-xs px-3 py-1.5 flex gap-1"
                  >
                    {item.status === "running" ? <FaRegFolderOpen /> : <FaPlay />}
                    {item.status === "running" ? "Open" : "Start"}
                  </Button>
                </Link>

                <Button
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => toggleModal(item.id)}
                >
                  <MdMoreHoriz />
                </Button>

                {openModalId === item.id && (
                  <div
                    ref={modalRef}
                    className="absolute top-full right-0 mt-1 p-3 bg-white shadow-lg rounded-lg z-10 min-w-[150px]"
                  >
                    {editModalId === item.id ? (
                      <div className="flex flex-col gap-2">
                        <input
                          className="border px-2 py-1 rounded text-sm"
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                        />
                        <Button
                          className="text-sm"
                          onClick={() => {
                            onRename(item.id, editName);
                            setEditModalId(null);
                          }}
                        >
                          변경
                        </Button>
                        <Button
                          variant="secondary"
                          className="text-sm"
                          onClick={() => setEditModalId(null)}
                        >
                          취소
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <Button
                          className="text-sm"
                          onClick={() => startEdit(item)}
                        >
                          수정
                        </Button>
                        <Button
                          className="text-sm"
                          onClick={() => onLeave(item.id)}
                        >
                          나가기
                        </Button>
                        <Button
                          variant="destructive"
                          className="text-sm"
                          onClick={() => onDelete(item.id)}
                        >
                          삭제
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500">컨테이너가 없습니다.</p>
        )}
      </div>

      <Pagination currentPage={1} totalPages={99} />
    </section>
  );
}
