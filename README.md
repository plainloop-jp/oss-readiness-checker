# OSS Readiness Checker

A small command-line tool that checks whether a project has the basic files
people expect from an open-source repository.

It is designed for developers who are publishing an open-source project for
the first time and want a simple checklist.

## What it checks

The first version checks for:

- `README`
- `LICENSE`
- `CONTRIBUTING`
- `SECURITY`
- A common project manifest such as `package.json`, `pyproject.toml`,
  `Cargo.toml`, or `go.mod`

Each item is worth 20 points.

## Requirements

- Node.js 20 or later

## Usage

Run the checker against the current folder:

```sh
node ./src/cli.js check .
```

Check another project:

```sh
node ./src/cli.js check ../my-project
```

Output machine-readable JSON for CI:

```sh
node ./src/cli.js check . --json
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

Score: 60 / 100
```

The command exits with status code `0` when all checks pass and `1` when
something is missing. This makes it useful in automated workflows.

When a missing file has a relevant guide, the checker also prints a
`Learn more` link with practical next steps.

## Development

Run the tests:

```sh
npm test
```

Run the checker against this repository:

```sh
npm run check
```

## Roadmap

- Add checks for README content quality
- Suggest fixes for missing files
- Publish a GitHub Action
- Add configurable rules

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Security

For security reports, see [SECURITY.md](SECURITY.md).

## License

[MIT](LICENSE)
