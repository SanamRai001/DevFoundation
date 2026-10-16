# Project State

- **Goal:** Reusable CLI-first full-stack TypeScript starter for future projects.
- **Repository:** SanamRai001/DevFoundation
- **Working branch:** `feat/f1d-cli-usability` (based on `main`)
- **Phase:** F1D first-use documentation and CLI output-location improvements implemented; PR #2 draft, awaiting merge approval.
- **Baseline:** PR #1 squash-merged to `main` at `7cef454fe60421ea3e69f6cea4dcb6680a4da955`; post-merge Ubuntu and Windows CI passed (38860184473).

## Scope / implementation
- Correct README to use `main` rather than the previous feature branch.
- Add optional `--output <existing-parent-directory>` to create generated projects alongside the DevFoundation checkout or in another selected location.
- Keep names strict, reject invalid options, avoid overwrites, stage and clean temporary files, and preserve default behavior.
- Add Node CLI regression tests covering the output option and collisions.
- Preserve tiny replaceable React connectivity demo; no management dashboard.

## Verification
- Baseline PR #1 tests/CI: **PASSED** on Ubuntu and Windows Node 24.
- F1D Linux + Windows GitHub Actions CI [38861070613](https://github.com/SanamRai001/DevFoundation/actions/runs/38861070613): **PASSED** install, lint, typecheck, tests, CLI regression tests, generated project installation/check and builds.
- Real browser/manual Windows UI verification: **NOT RUN**.

## Risks
- Node 24/npm required; local user environment and browser behavior are not verified.
- Generated projects need product-specific security, authentication, database and deployment decisions.
- No open-source license selected.

## Next
PR #2 is ready for user merge approval after final CI. Do not merge without permission. Next: design an opt-in PostgreSQL/Drizzle module only when its installation flow and concrete use case are clear; keep the mandatory core minimal.
