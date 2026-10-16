# Contributing to DevFoundation

Thanks for helping make a full-stack TypeScript starter approachable for beginners.

## Ways to contribute

You don't have to be an expert. Useful contributions include fixing typos, improving beginner instructions, reporting reproducible bugs, adding focused tests, and simplifying setup steps. Browse the [issues](https://github.com/SanamRai001/DevFoundation/issues) or open an issue explaining your idea.

## Before making a code change

1. Read the [README](README.md), the [getting-started guide](docs/GETTING_STARTED.md), and [AGENTS.md](AGENTS.md).
2. Keep the database-free starter lightweight. New services and dependencies must have a concrete use case.
3. Choose a small, well-scoped improvement and say how you'll verify it.
4. Use a feature branch, not `main`, for your changes.

## Test your changes

Use Node.js 24 LTS, install from the committed lockfile, and run:

```powershell
npm ci
npm run doctor
npm run check
```

For CLI work, also run `npm run test:cli`. Test both the plain starter and optional database starter if you change shared scaffolding logic. GitHub Actions checks Ubuntu, Windows and PostgreSQL integration. Don't claim a test passed without running it.

Include a short PR explanation: what changed, why, how you tested it, and any known limitations. Prefer one focused pull request over unrelated changes.

## Beginner-friendly documentation

Write simple steps that work from a fresh clone, use runnable commands, explain the expected result, and clarify which folder each command runs from. Don't claim the CLI is published to npm, provisions PostgreSQL, or deploys to production.

## Security and licensing

Never commit credentials, local `.env` files, personal information, or private datasets. Don't post exploitation details or secrets in a public issue; first reach out to the repository maintainer through an appropriate private channel if available.

DevFoundation's starter code is licensed under the [MIT License](LICENSE). Contributions should be compatible with that license. Third-party code and assets must have compatible permissions, and attribution requirements must be preserved.

See [project status](docs/PROJECT_STATE.md) for the current implementation phase.
