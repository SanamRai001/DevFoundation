# Agent working agreement

1. Inspect current files, architecture docs, git status/branch/history and tests before each meaningful phase.
2. State the smallest useful scope, acceptance criteria, UX/API/data impacts, failure cases and risks before changing architecture.
3. Favor simple vertical slices. Preserve unrelated changes and existing behavior. Avoid speculative abstractions.
4. Keep the demonstration UI tiny and replaceable; this is a starter, not a dashboard app.
5. Share runtime contracts through `packages/contracts`, prefer existing tooling and add dependencies only with justification.
6. Follow security basics: server-side validation, least privilege, no secrets in commits, bounded inputs, safe error messages.
7. Add focused tests for new behavior. Run lightweight checks if possible; never report tests as passing without executing them.
8. Update only `docs/PROJECT_STATE.md` for phase handoff; architecture details live in `docs/ARCHITECTURE.md`.
9. Use safe feature branches; do not merge, deploy, rewrite history, delete branches or discard unrelated changes without explicit permission.
10. Provide exact PowerShell commands for time-consuming verification on Windows and explain expected results and manual smoke tests.
