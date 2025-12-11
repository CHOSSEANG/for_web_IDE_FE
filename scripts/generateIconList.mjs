import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const ICON_DIR = join(__dirname, "../public/icons");
const OUTPUT = join(__dirname, "../src/generated-icon-list.ts");

mkdirSync(join(OUTPUT, ".."), { recursive: true });

const files = readdirSync(ICON_DIR).filter((file) => file.endsWith(".svg"));

const content =
  `export const iconList = ${JSON.stringify(files, null, 2)} as const;\n`;

writeFileSync(OUTPUT, content);

console.log("generated-icon-list.ts 생성 완료!");
