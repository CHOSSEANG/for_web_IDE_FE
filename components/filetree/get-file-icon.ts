import { getIconForFile } from "vscode-icons-js";
import icons from "vscode-icons/icons";

export function getFileIcon(filename: string) {
  const iconName = getIconForFile(filename);

  if (!iconName) return null;

  return icons[iconName] || null;
}
