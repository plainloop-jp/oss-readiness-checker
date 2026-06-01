#!/usr/bin/env node

import { readFile } from "node:fs/promises";

import { checkProject } from "./checker.js";

const packageJson = JSON.parse(
  await readFile(new URL("../package.json", import.meta.url), "utf8")
);
const VERSION = packageJson.version;

function printHelp() {
  console.log(`OSS Readiness Checker

Usage:
  oss-ready check [path] [--json]
  oss-ready --help
  oss-ready --version

Examples:
  oss-ready check .
  oss-ready check ../my-project
  oss-ready check . --json`);
}

function parseArguments(args) {
  if (args.includes("--help") || args.includes("-h")) {
    return { command: "help" };
  }

  if (args.includes("--version") || args.includes("-v")) {
    return { command: "version" };
  }

  const json = args.includes("--json");
  const positional = args.filter((argument) => argument !== "--json");

  if (positional.length === 0) {
    return { command: "check", path: ".", json };
  }

  if (positional[0] !== "check" || positional.length > 2) {
    return { command: "invalid" };
  }

  return { command: "check", path: positional[1] ?? ".", json };
}

function printReport(report) {
  console.log("OSS Readiness Checker");
  console.log(`Project: ${report.projectPath}`);
  console.log("");

  for (const result of report.results) {
    const status = result.passed ? "PASS" : "MISS";
    console.log(`[${status}] ${result.label}: ${result.message}`);
    if (result.learnMore) {
      console.log(`       Learn more: ${result.learnMore}`);
    }
  }

  console.log("");
  console.log(`Score: ${report.score} / ${report.maxScore}`);
}

async function main() {
  const options = parseArguments(process.argv.slice(2));

  if (options.command === "help") {
    printHelp();
    return;
  }

  if (options.command === "version") {
    console.log(VERSION);
    return;
  }

  if (options.command === "invalid") {
    console.error("Invalid arguments.");
    printHelp();
    process.exitCode = 2;
    return;
  }

  try {
    const report = await checkProject(options.path);
    if (options.json) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      printReport(report);
    }

    process.exitCode = report.passed ? 0 : 1;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 2;
  }
}

await main();
