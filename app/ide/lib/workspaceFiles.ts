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
      {
        id: "file-java-example",
        name: "Example.java",
        type: "file",
        content: `public class Example {
    public static void main(String[] args) {
        System.out.println("Hello from Java!");
    }
}`,
      },
      {
        id: "file-python-example",
        name: "script.py",
        type: "file",
        content: `def greet(name):
    print(f"Hello, {name} from Python!")

greet("WebIC User")`,
      },
    ],
  },
];
