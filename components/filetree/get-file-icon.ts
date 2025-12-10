import { getIcon } from "vscode-icons-js";
import icons from "vscode-icons/icons";

export function getFileIcon(filename: string) {
  const icon = getIcon(filename);

  if (!icon) return null;

  const iconName = icon.name;      // ex) "javascript", "typescript", "markdown"

  // vscode-icons 리소스에서 아이콘 파일 찾기
  return icons[iconName] || null;
}
