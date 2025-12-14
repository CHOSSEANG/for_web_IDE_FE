"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Toggle } from "@/components/ui/toggle";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function FormPreview() {
  return (
    <main className="min-h-screen bg-bg-base text-text-primary p-10">

      <div className="flex justify-end mb-6">
        <ThemeToggle />
      </div>

      <h1 className="text-2xl font-semibold mb-6">WebIC Form UI Preview</h1>

      <div className="space-y-6 max-w-sm">

        {/* Input */}
        <div className="space-y-2">
          <p className="font-medium">Input</p>
          <Input placeholder="파일명 입력…" />
        </div>

        {/* Select */}
        <div className="space-y-2">
          <p className="font-medium">Select</p>
          <Select>
            <SelectTrigger />
            <SelectContent>
              <SelectItem value="ts">TypeScript</SelectItem>
              <SelectItem value="js">JavaScript</SelectItem>
              <SelectItem value="md">Markdown</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Checkbox */}
        <div className="flex items-center gap-3">
          <Checkbox id="auto-save" />
          <label htmlFor="auto-save">자동 저장</label>
        </div>

        {/* Toggle */}
        <div className="flex items-center gap-3">
          <Toggle id="preview" />
          <label htmlFor="preview">프리뷰 활성화</label>
        </div>

      </div>
    </main>
  );
}
