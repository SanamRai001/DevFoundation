# DevFoundation

**CLI-first full-stack TypeScript foundation.** No management dashboard or visual project builder.

## Create a project

Requires Node.js 24 LTS and npm. On a fresh clone:

```powershell
git clone https://github.com/SanamRai001/DevFoundation.git
cd DevFoundation
npm ci
npm run create -- my-app --output ..
```

The CLI copies the React/Vite + Express + shared Zod starter into a new project directory, renames workspace identities, keeps the dependency lockfile coherent and installs packages via `npm ci`. With `--output ..`, the project is created **alongside** the cloned DevFoundation repository; without it, the project is created under the current directory. The output parent must already exist. Existing targets are never overwritten. The generator never publishes to GitHub, merges branches or deploys anything.

```powershell
cd my-app
npm run check
npm run dev
```

Pass `--no-install` to skip installation; use `--output "D:\\Projects"` to choose an existing parent folder. Run `npm run doctor` to inspect the starter's Node version and required files. Run `npm run test:cli` for CLI regression tests.

## Generated project

- `apps/web`: replaceable React example screen demonstrating API loading/error/success; **not** a DevFoundation management UI.
- `apps/api`: Express API, health route, bounded request JSON, Helmet and structured error responses.
- `packages/contracts`: typed Zod contracts.
- Automated unit and API integration checks, TypeScript, linting, GitHub Actions and docs.

Frontend: http://127.0.0.1:5173; health endpoint: http://127.0.0.1:3001/api/v1/health.

## Design boundaries

- Initial generator creates one complete full-stack starter. Don't add a template wizard or optional modules before real demand.
- CLI is invoked locally from this repository; an `npx` command needs publishing and is not available yet.
- Generated repositories are independent and do not contain generator code or Git history.
- Use a safe feature branch and reviewed PRs. Add auth, database and deployment later when required.

See [Architecture](docs/ARCHITECTURE.md), [State](docs/PROJECT_STATE.md), and [Agent rules](AGENTS.md).

## License

No open-source license has been selected. A public repository alone does not grant third parties reuse rights.
