# DevFoundation project state

- Base: `main` at `4c7b006c64e1c27387cf90cafd7553a77ef7a4e6`; open-source README and MIT license merged.
- Working branch: `feat/f3a-beginner-notes-example`.
- Current phase: F3A — optional end-to-end Notes teaching example and detailed follow-along guide.
- Beginner flow: `npm run create -- learning-notes --database postgres --example notes`.
- Goal: Prove a real React → Express → Zod → Drizzle → PostgreSQL CRUD workflow without polluting the database-free template.

## Scope and verification
- Real Notes add/list/complete/delete UI/API with safe validation and generated migrations.
- Independent user-facing tutorial and first feature-change exercise.
- Cross-platform generation/build tests and disposable PostgreSQL HTTP CRUD checks added to CI.
- F3A CI: PENDING. No external beginner usability testing or public deployment.

## Risks
- Notes example has no authentication: **local learning only**.
- SQL schema migrations require inspection; do not run against real production data.
- GitHub source CLI still requires cloning/installing; shorter distribution is a future step.
- No stable public release or npm package publication yet. GitHub-source npx distribution under CI verification.
- Release and support policy docs added; independent first-time testing and live demonstration still pending.

## Next
Fix CI until all tests pass and open reviewable PR. Do not merge/deploy without owner approval. Then improve installer distribution and release evidence.
