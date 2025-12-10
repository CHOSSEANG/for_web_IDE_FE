const fs = require("fs");
const path = require("path");

const ICON_DIR = path.join(__dirname, "../public/icons");
const OUTPUT = path.join(__dirname, "../src/generated-icon-list.ts");

const files = fs.readdirSync(ICON_DIR).filter(f => f.endsWith(".svg"));

const content =
  `export const iconList = ${JSON.stringify(files, null, 2)} as const;\n`;

fs.writeFileSync(OUTPUT, content);

console.log("generated-icon-list.ts 생성 완료!");
