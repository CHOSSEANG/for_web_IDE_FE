import { spawn } from "node:child_process";
import path from "node:path";

const nextCommand = process.platform === "win32" ? "next.cmd" : "next";

const child = spawn(nextCommand, ["build", "--webpack"], {
  env: {
    ...process.env,
    NEXT_DISABLE_TURBOPACK: "1",
    NEXT_TURBOPACK: "0",
  },
  stdio: "inherit",
  cwd: path.resolve(process.cwd()),
});

child.on("close", (code) => {
  process.exit(code ?? 0);
});

child.on("error", (error) => {
  console.error("Failed to run Next.js build:", error);
  process.exit(1);
});
