import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { checkProject } from "../src/checker.js";

async function createProject(files) {
  const projectPath = await mkdtemp(join(tmpdir(), "oss-ready-"));

  for (const file of files) {
    const filePath = join(projectPath, file);
    if (file.includes("/")) {
      await mkdir(join(projectPath, file.split("/")[0]), { recursive: true });
    }
    await writeFile(filePath, "");
  }

  return projectPath;
}

test("reports a perfect score when all expected files exist", async (context) => {
  const projectPath = await createProject([
    "README.md",
    "LICENSE",
    "CONTRIBUTING.md",
    "SECURITY.md",
    "package.json"
  ]);
  context.after(() => rm(projectPath, { recursive: true, force: true }));

  const report = await checkProject(projectPath);

  assert.equal(report.score, 100);
  assert.equal(report.maxScore, 100);
  assert.equal(report.passed, true);
});

test("reports missing files and a lower score", async (context) => {
  const projectPath = await createProject(["README.md", "pyproject.toml"]);
  context.after(() => rm(projectPath, { recursive: true, force: true }));

  const report = await checkProject(projectPath);

  assert.equal(report.score, 40);
  assert.equal(report.passed, false);
  assert.deepEqual(
    report.results.filter((result) => !result.passed).map((result) => result.id),
    ["license", "contributing", "security"]
  );
  assert.equal(
    report.results.find((result) => result.id === "license").learnMore,
    "https://choosealicense.com/"
  );
  assert.match(
    report.results.find((result) => result.id === "security").learnMore,
    /adding-a-security-policy/
  );
});

test("finds supported files inside the .github directory", async (context) => {
  const projectPath = await createProject([
    "README.md",
    "LICENSE.txt",
    ".github/CONTRIBUTING.md",
    ".github/SECURITY.md",
    "Cargo.toml"
  ]);
  context.after(() => rm(projectPath, { recursive: true, force: true }));

  const report = await checkProject(projectPath);

  assert.equal(report.score, 100);
  assert.equal(report.passed, true);
});

test("rejects a path that is not a directory", async () => {
  await assert.rejects(
    () => checkProject("./this-directory-does-not-exist"),
    /Project directory not found/
  );
});
