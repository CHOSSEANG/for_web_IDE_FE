import type { ReactNode } from "react";
import type { TemplateId, TemplateMeta } from "@/components/dashboard/templateMeta";

export type TemplateWithIcon = TemplateMeta & {
  name: TemplateId;
  icon: ReactNode;
};
