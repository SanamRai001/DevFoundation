# Project State

- **Goal:** Reusable CLI-first full-stack TypeScript starter for future projects.
- **Repository:** SanamRai001/DevFoundation
- **Working branch:** `feat/f1d-cli-usability` (based on `main`)
- **Phase:** F1D first-use documentation and CLI output-location improvements.
- **Baseline:** PR #1 squash-merged to `main` at `7cef454fe60421ea3e69f6cea4dcb6680a4da955`; post-merge Ubuntu and Windows CI passed (38860184473).

## Scope / implementation
- Correct README to use `main` rather than the previous feature branch.
- Add optional `--output <existing-parent-directory>` to create generated projects alongside the DevFoundation checkout or in another selected location.
- Keep names strict, reject invalid options, avoid overwrites, stage and clean temporary files, and preserve default behavior.
- Add Node CLI regression tests covering the output option and collisions.
- Preserve tiny replaceable React connectivity demo; no management dashboard.

## Verification
- Baseline PR #1 tests/CI: **PASSED** on Ubuntu and Windows Node 24.
- F1D lint, CLI tests, generation and independent `npm ci`/build: **PENDING CI**.
- Real browser/manual Windows UI verification: **NOT RUN**.

## Risks
- Node 24/npm required; local user environment and browser behavior are not verified.
- Generated projects need product-specific security, authentication, database and deployment decisions.
- No open-source license selected.

## Next
Review F1D PR after CI, request user approval before merge. Then prioritize optional PostgreSQL/Drizzle module only when its use case and installation UX are defined. Do not add it to the mandatory core.
