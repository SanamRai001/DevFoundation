# DevFoundation — project state

- **Baseline:** `main` at `f20cdfbefd9dec37c3f101032fbe2d71b12fb68b`; F3 merged with 10/10 post-merge CI.
- **Working branch:** `feat/f4-zero-db-preview-accessibility`.
- **Current phase:** F4 — remove PostgreSQL from first-run Notes example and prepare a safe public interactive preview, browser accessibility tests and release gates.

## Acceptance
- `--example notes` without `--database` builds and runs an Express API backed by disposable process memory; no DB dependency or migration needed.
- `--database postgres --example notes` keeps real persistent Notes behavior and existing integration tests.
- Default starter without an example remains unchanged.
- Browser UI tests verify create, complete, delete, refresh and meaningful error display, plus WCAG A/AA checks.
- Static public preview is **browser-only demonstration**, explicitly not a hosted API, storage or representation of a deployed full-stack service.
- Publish preview only after passing review; do not publish live unauthenticated API.
- The previous GitHub-source CLI integration pin to a deleted/stale branch is replaced with a current revision in CI.
- **Status:** implementation and verification pending. No npm registry publication; npm 2FA issues do not block this phase.

## Next
Run exact-head CI, inspect screenshot and open draft PR. Do not merge, release, or deploy an unprotected backend without explicit review. Independent beginner feedback remains tracked in issue #6.
