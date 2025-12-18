import type { FileSystemItem } from "@/app/ide/types/fileTypes";

export const initialFiles: FileSystemItem[] = [
  {
    id: "root-welcome",
    name: "welcome.ts",
    type: "file",
    content: `console.log("Welcome to WebIC IDE");`,
  },
  {
    id: "folder-src",
    name: "src",
    type: "folder",
    isOpen: true,
    children: [
      {
        id: "file-main",
        name: "main.ts",
        type: "file",
        content: `function main() {
  console.log("Hello World");
}

main();`,
      },
    ],
  },
];
