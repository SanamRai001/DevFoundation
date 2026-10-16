# Project State

- **Goal:** Reusable minimal full-stack TypeScript starter for future projects.
- **Repository:** SanamRai001/DevFoundation
- **Working branch:** `feat/foundation-v0-core`
- **Phase:** F0 foundation decisions, F1 initial implementation under review (not release-ready).
- **Baseline:** New empty public GitHub repository; `main` initialized with README, no prior product code or tests.

## Intended scope
React/Vite web example, Express API, shared Zod contract, npm workspaces, lint/format, tests, environment validation, CI, and documentation.

## Deliberately excluded
Auth, database, ORM, Docker, queues, payments, admin dashboard, custom generator and deployment.

## Verification
- GitHub repository inspected and feature branch created.
- Dependency resolution, local Node 24 build and browser smoke test: **NOT RUN** (execution environment has no npm registry access).
- Root lockfile: **NOT YET GENERATED**. Must commit before merge.
- No claims of passing CI until a GitHub workflow completes.

## Risks
- Package versions and scripts need real installation and execution.
- CI must be switched to `npm ci` after lockfile is committed.
- No license selected; request owner decision before adopting an open-source license.

## Next phase
Complete F1 implementation, create PR, run Node 24 clean install and required tests, inspect diffs, then decide whether to merge. F2 (database) is explicitly deferred.
