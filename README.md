# DevFoundation

A **minimal, reusable TypeScript full-stack starter**, not a project-management application.

> Initial foundation is under review. Do not use as a production template until its local checks and dependency lockfile are verified.

## What you get
- React + Vite web application with a small, replaceable API connection screen
- Express API with a health endpoint, structured errors, safe defaults, and shutdown handling
- Shared Zod API contracts
- npm workspaces, TypeScript, ESLint, Prettier, Vitest, and GitHub Actions

No database, authentication, billing, or custom generator in v0. Those are optional future modules.

## Prerequisites
- Node.js **24 LTS** and npm (use a recent npm distributed with Node 24)
- Windows PowerShell, macOS, or Linux

## Development
```powershell
npm install
npm run dev
```

Open http://127.0.0.1:5173 to see the starter's API status. The Express API defaults to http://127.0.0.1:3001. Optional settings are shown in `.env.example`.

## Verification
```powershell
npm run lint
npm run typecheck
npm run test
npm run build
```

**Bootstrap note:** The initial branch cannot include a generated `package-lock.json` until dependencies can be installed and resolved. Run `npm install` with Node 24, commit the generated root lockfile to the feature branch, change CI to `npm ci`, and rerun CI **before merging**. A green install without a committed lockfile is not release-ready.

## How to reuse
Once this foundation is verified and merged, use GitHub's **Use this template** option. Replace the demonstration page and health response details with the new project's functionality, and update `docs/PROJECT_STATE.md`. Keep infrastructure modules optional.

## Project decisions
See [Architecture](docs/ARCHITECTURE.md), [Project State](docs/PROJECT_STATE.md), and [Agent Rules](AGENTS.md).

## License
No open-source license has been selected yet. GitHub visibility alone does not grant reuse rights to third parties.
