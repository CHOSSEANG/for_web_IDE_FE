import type { TemplateId } from "./templateMeta";
import type { ReactNode } from "react";

export type TemplateWithIcon = {
  id: TemplateId;
  displayName: string;
  desc: string;
  icon: ReactNode;
};
