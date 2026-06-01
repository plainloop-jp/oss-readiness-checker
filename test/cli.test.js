import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);
const packageJson = JSON.parse(
  await readFile(new URL("../package.json", import.meta.url), "utf8")
);

test("--version matches the package version", async () => {
  const { stdout } = await execFileAsync(
    process.execPath,
    [fileURLToPath(new URL("../src/cli.js", import.meta.url)), "--version"]
  );

  assert.equal(stdout.trim(), packageJson.version);
});
