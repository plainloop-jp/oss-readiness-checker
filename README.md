# OSS Readiness Checker

[![CI](https://github.com/plainloop-jp/oss-readiness-checker/actions/workflows/ci.yml/badge.svg)](https://github.com/plainloop-jp/oss-readiness-checker/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/oss-readiness-checker.svg)](https://www.npmjs.com/package/oss-readiness-checker)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A small command-line tool that checks whether a project has the basic files
people expect from an open-source repository.

It is designed for developers who are publishing an open-source project for
the first time and want a simple checklist.

## 日本語で試す

OSS として公開したいフォルダに、基本的なファイルがそろっているかを
100 点満点で確認するツールです。インストールせずに試せます。

Windows の PowerShell:

```powershell
npx.cmd oss-readiness-checker check .
```

macOS または Linux:

```sh
npx oss-readiness-checker check .
```

Node.js 20 以上が必要です。詳しい説明は、このあとの英語版をご覧ください。

## Demo

![OSS Readiness Checker example output](https://raw.githubusercontent.com/plainloop-jp/oss-readiness-checker/main/assets/demo.svg)

## What it checks

The first version checks for:

- `README`
- `LICENSE`
- `CONTRIBUTING`
- `SECURITY`
- A common project manifest such as `package.json`, `pyproject.toml`,
  `Cargo.toml`, or `go.mod`

Each item is worth 20 points.

The checker also suggests adding a `Usage`, `Getting Started`, or `Quick Start`
section when a README does not explain how to begin. Suggestions do not affect
the score or exit code.

## Requirements

- Node.js 20 or later

## Usage

Run the checker against the current folder without installing it:

```sh
npx oss-readiness-checker check .
```

Check another project:

```sh
npx oss-readiness-checker check ../my-project
```

Output machine-readable JSON for CI:

```sh
npx oss-readiness-checker check . --json
```

Example:

```text
OSS Readiness Checker
Project: /path/to/my-project

[PASS] README: Project documentation found.
[PASS] LICENSE: License file found.
[MISS] CONTRIBUTING: Add CONTRIBUTING.md to explain how people can help.
       Learn more: https://docs.github.com/communities/setting-up-your-project-for-healthy-contributions/setting-guidelines-for-repository-contributors
[MISS] SECURITY: Add SECURITY.md to explain how to report vulnerabilities.
       Learn more: https://docs.github.com/code-security/getting-started/adding-a-security-policy-to-your-repository
[PASS] PROJECT MANIFEST: Project manifest found.

Suggestions:
[WARN] README USAGE: Add a Usage, Getting Started, or Quick Start section so people know how to begin.
       Learn more: https://docs.github.com/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes

Score: 60 / 100
```

The command exits with status code `0` when all checks pass and `1` when
something is missing. This makes it useful in automated workflows.

When a missing file has a relevant guide, the checker also prints a
`Learn more` link with practical next steps.

## GitHub Action

Run the checker automatically after each push and pull request by adding
`.github/workflows/oss-readiness.yml` to your repository:

```yaml
name: OSS Readiness

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

permissions:
  contents: read

jobs:
  check:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v6
      - uses: plainloop-jp/oss-readiness-checker@v0.3.0
```

By default, the action checks the repository root. Use the optional `path`
input when the project is inside a subdirectory.

## Development

Run the local source code:

```sh
node ./src/cli.js check .
```

Run the tests:

```sh
npm test
```

Run the checker against this repository:

```sh
npm run check
```

## Roadmap

- Add more checks for README content quality
- Suggest fixes for missing files
- Add configurable rules

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Security

For security reports, see [SECURITY.md](SECURITY.md).

## License

[MIT](LICENSE)
