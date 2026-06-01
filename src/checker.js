import { readdir, stat } from "node:fs/promises";
import { resolve } from "node:path";

const POINTS_PER_CHECK = 20;

const CHECKS = [
  {
    id: "readme",
    label: "README",
    candidates: ["README", "README.md", "README.rst", "README.txt"],
    pass: "Project documentation found.",
    miss: "Add README.md to explain what the project does and how to use it.",
    learnMore:
      "https://docs.github.com/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes"
  },
  {
    id: "license",
    label: "LICENSE",
    candidates: ["LICENSE", "LICENSE.md", "LICENSE.txt", "COPYING"],
    pass: "License file found.",
    miss: "Add a LICENSE file so people know how they may use the project.",
    learnMore: "https://choosealicense.com/"
  },
  {
    id: "contributing",
    label: "CONTRIBUTING",
    candidates: ["CONTRIBUTING", "CONTRIBUTING.md", ".github/CONTRIBUTING.md"],
    pass: "Contribution guide found.",
    miss: "Add CONTRIBUTING.md to explain how people can help.",
    learnMore:
      "https://docs.github.com/communities/setting-up-your-project-for-healthy-contributions/setting-guidelines-for-repository-contributors"
  },
  {
    id: "security",
    label: "SECURITY",
    candidates: ["SECURITY", "SECURITY.md", ".github/SECURITY.md"],
    pass: "Security policy found.",
    miss: "Add SECURITY.md to explain how to report vulnerabilities.",
    learnMore:
      "https://docs.github.com/code-security/getting-started/adding-a-security-policy-to-your-repository"
  },
  {
    id: "manifest",
    label: "PROJECT MANIFEST",
    candidates: [
      "package.json",
      "pyproject.toml",
      "Cargo.toml",
      "go.mod",
      "pom.xml",
      "build.gradle",
      "composer.json",
      "Gemfile"
    ],
    pass: "Project manifest found.",
    miss: "Add a common project manifest such as package.json or pyproject.toml.",
    learnMore: null
  }
];

async function isDirectory(path) {
  try {
    return (await stat(path)).isDirectory();
  } catch {
    return false;
  }
}

async function listFiles(root) {
  const rootEntries = await readdir(root, { withFileTypes: true });
  const files = new Set();

  for (const entry of rootEntries) {
    files.add(entry.name.toLowerCase());
  }

  const githubDirectory = resolve(root, ".github");
  if (await isDirectory(githubDirectory)) {
    const githubEntries = await readdir(githubDirectory, { withFileTypes: true });
    for (const entry of githubEntries) {
      files.add(`.github/${entry.name}`.toLowerCase());
    }
  }

  return files;
}

export async function checkProject(path = ".") {
  const projectPath = resolve(path);

  if (!(await isDirectory(projectPath))) {
    throw new Error(`Project directory not found: ${projectPath}`);
  }

  const files = await listFiles(projectPath);
  const results = CHECKS.map((check) => {
    const matchedFile = check.candidates.find((candidate) =>
      files.has(candidate.toLowerCase())
    );

    return {
      id: check.id,
      label: check.label,
      passed: Boolean(matchedFile),
      matchedFile: matchedFile ?? null,
      message: matchedFile ? check.pass : check.miss,
      learnMore: matchedFile ? null : check.learnMore,
      points: matchedFile ? POINTS_PER_CHECK : 0
    };
  });

  return {
    projectPath,
    score: results.reduce((total, result) => total + result.points, 0),
    maxScore: CHECKS.length * POINTS_PER_CHECK,
    passed: results.every((result) => result.passed),
    results
  };
}
