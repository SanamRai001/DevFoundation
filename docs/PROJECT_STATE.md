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
- F3A exact-head GitHub Actions [38869497761](https://github.com/SanamRai001/DevFoundation/actions/runs/38869497761): **all ten jobs passed**, including plain starter, PostgreSQL profile, Notes example and GitHub-source npx installer on Windows/Ubuntu, plus disposable PostgreSQL HTTP CRUD and genuine Notes browser screenshot artifact.
- Screenshot artifact has been generated automatically; manual visual review and independent beginner usability testing have **not** been completed. No public deployment.

## Risks
- Notes example has no authentication: **local learning only**.
- SQL schema migrations require inspection; do not run against real production data.
- GitHub source CLI still requires cloning/installing; shorter distribution is a future step.
- No stable public release or npm package publication yet. GitHub-source npx distribution verified cross-platform; npm registry distribution remains unpublished.
- Release and support policy docs added; independent first-time testing and live demonstration still pending.

## Next
PR #5 is open as a draft for owner review; do not merge, tag a stable release or deploy without approval. Next: invite independent testers, review real demo and decide whether to create a preview GitHub Release. Registry publishing needs an npm maintainer and 2FA.
