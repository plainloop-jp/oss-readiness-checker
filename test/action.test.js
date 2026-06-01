import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);
const actionPath = fileURLToPath(new URL("../src/action.js", import.meta.url));

test("GitHub Action reports a perfect score for this repository", async () => {
  const { stdout } = await execFileAsync(process.execPath, [actionPath], {
    env: { ...process.env, INPUT_PATH: "." }
  });

  assert.match(stdout, /Score: 100 \/ 100/);
});

test("GitHub Action fails when required files are missing", async (context) => {
  const projectPath = await mkdtemp(join(tmpdir(), "oss-ready-action-"));
  context.after(() => rm(projectPath, { recursive: true, force: true }));

  await assert.rejects(
    () =>
      execFileAsync(process.execPath, [actionPath], {
        env: { ...process.env, INPUT_PATH: projectPath }
      }),
    (error) => {
      assert.equal(error.code, 1);
      assert.match(error.stdout, /Score: 0 \/ 100/);
      return true;
    }
  );
});
