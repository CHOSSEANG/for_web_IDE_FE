"use client";

import { DropdownMenu, DropdownMenuTrigger, DropdownContent, DropdownItem, DropdownSeparator, DropdownLabel } from "@/components/ui/dropdown";
import { Button } from "@/components/ui/button";
import { Settings, Folder, Code2, LogOut } from "lucide-react";

export default function DropdownPreview() {
  return (
    <main className="min-h-screen bg-bg-base text-text-primary p-10">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            메뉴 보기
          </Button>
        </DropdownMenuTrigger>

        <DropdownContent>
          <DropdownLabel>프로젝트</DropdownLabel>
          <DropdownItem>
            <Folder className="w-4 h-4 mr-2"/> 새 폴더
          </DropdownItem>
          <DropdownItem>
            <Code2 className="w-4 h-4 mr-2"/> 새 파일
          </DropdownItem>

          <DropdownSeparator />

          <DropdownLabel>설정</DropdownLabel>
          <DropdownItem>
            <Settings className="w-4 h-4 mr-2"/> 환경설정
          </DropdownItem>

          <DropdownSeparator />

          <DropdownItem className="text-error">
            <LogOut className="w-4 h-4 mr-2"/> 로그아웃
          </DropdownItem>
        </DropdownContent>
      </DropdownMenu>
    </main>
  );
}
