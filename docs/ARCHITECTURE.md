# Architecture decisions

## Purpose
Help one developer start maintainable, secure, testable full-stack TypeScript products quickly without imposing domain-specific logic.

## Structure
- `apps/web`: replaceable React + Vite sample showing actual API integration.
- `apps/api`: Express application separated from server startup for testability.
- `packages/contracts`: Zod schemas and inferred types, compiled to JS and declarations for Node and browser consumers.
- Root: shared developer tooling, workspace scripts, CI and project documentation.

## Decisions
1. **Vertical slices, not frontend-first or backend-first completion.** Initial example crosses frontend, API and contract; next examples should be useful complete user behaviors.
2. **npm workspaces before monorepo tooling.** Avoid Turborepo/Nx until build caching or task orchestration creates a measured need.
3. **Contract package compiles to dist.** Node imports real JavaScript with declarations; root scripts build contracts before consumers.
4. **No authentication, PostgreSQL or ORM in v0.** Those are project-dependent; add only after the base foundation has a clean install and passing checks.
5. **No full UI for the foundation.** A deliberately tiny example page proves the frontend and API are wired; it is not a permanent admin dashboard.
6. **Local proxy during development.** Web requests use `/api` via Vite proxy; no wildcard CORS in Express.
7. **Environment parsing occurs when the API starts.** App tests can instantiate Express without opening a port.
8. **Use short-lived feature branches and reviewed PRs.** Never merge/deploy/delete unrelated work by default.

## Security boundaries
No real secrets in Git. .env is ignored. No auth is implied by a health endpoint. API disables X-Powered-By, applies security headers and limits JSON request size. Standard JSON error bodies exclude stack traces. Production still requires a real deployment configuration, HTTPS proxy and monitoring.

## Known risks and deferred work
- Node 24 GitHub Actions produced the committed npm lockfile. A subsequent clean `npm ci` verification is required before considering F1 complete.
- API/web integration is verified by automated tests; manual browser smoke testing remains necessary.
- Contract package watch during development does not automatically restart all consumer processes on contract edits; restart `npm run dev` after contract changes.
- Not a production server deployment recipe.
- No database, auth, migrations, E2E browser suite, deployment pipelines, or generator until justified.

## Acceptance criteria for F1
- `npm install` creates root lockfile, then `npm ci` works from clean checkout.
- `npm run dev` runs both apps on Windows.
- `GET /api/v1/health` matches the shared contract.
- Frontend shows loading, success and recoverable failure states.
- Lint, typecheck, tests, production builds and GitHub Actions pass.
- No secrets or unrelated features committed.
