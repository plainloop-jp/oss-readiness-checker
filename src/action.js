import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const cliPath = fileURLToPath(new URL("./cli.js", import.meta.url));
const projectPath = process.env.INPUT_PATH || ".";

const exitCode = await new Promise((resolve, reject) => {
  const child = spawn(process.execPath, [cliPath, "check", projectPath], {
    stdio: "inherit"
  });

  child.once("error", reject);
  child.once("exit", (code) => resolve(code ?? 1));
});

process.exitCode = exitCode;
