# Project State

- **Goal:** Reusable CLI-first TypeScript starter with opt-in database modules.
- **Repository:** SanamRai001/DevFoundation
- **Branch:** feat/f2-postgres-drizzle-opt-in, based on main at 481cc6756e264ba34351e03d1a5a5c4279f81fba.
- **Phase:** F2A optional PostgreSQL + Drizzle module implemented and CI-verified; pending PR review.

## Scope
- Preserve plain `npm run create -- app` flow and its lockfile without PostgreSQL dependencies.
- Opt-in via `npm run create -- app --database postgres`.
- Generate database source, schema, config, migration scripts, validation, health route and integration test, CI PostgreSQL service only for opted-in generated projects.
- Generate a correct lockfile, run clean npm ci, and publish only after a successful install.
- Do not add Docker/DB/authentication/billing to the core.

## Verification
- Main from PR #2: Windows/Ubuntu CI green.
- F2A GitHub Actions [38863303858](https://github.com/SanamRai001/DevFoundation/actions/runs/38863303858): ALL 5 jobs PASSED (Ubuntu and Windows base + PostgreSQL starter; Ubuntu PostgreSQL service migration and data roundtrip).

## Risks
- Requires reachable PostgreSQL and explicit DATABASE_URL for database-enabled applications.
- Example table must be replaced with real domain schema; migrations must be committed.
- The sample connection health endpoint should be removed/protected for deployments where it leaks infrastructure status.
- No npm registry publishing or deployment planned.

## Next
Open draft PR for review; do not merge without explicit approval. Future work: consider database profiles and create-module UX only with a real product use case.
