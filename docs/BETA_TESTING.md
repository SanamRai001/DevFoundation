# First-time developer usability test

We need **real independent feedback** before promoting DevFoundation as a widely recommended beginner starter. This is a reproducible test plan, not a claim that external testers have already passed it.

## Tester brief

Invite developers who have basic JavaScript knowledge but **haven't worked on DevFoundation**. Ask each tester to use a fresh directory and Node.js 24. Don't coach them while they try.

### Task A: first success (no database)

Create and run a plain starter using only the public README. Record:

- OS / Node version (no private device identifiers)
- whether the commands worked without manual fixes
- where the instructions were confusing
- approximate steps, without requiring precise elapsed-time metrics
- first error and how it was resolved

### Task B: real application

Using the [Notes tutorial](BUILD_A_NOTES_APP.md), create the Notes app, apply a migration to a disposable PostgreSQL database, create and complete a note, then make the 80-character title limit exercise and rerun tests. **Do not use production credentials.**

### Task C: optional one-command GitHub install

Try `npx --yes github:SanamRai001/DevFoundation quick-test --no-install` in a clean directory and report whether it created a functional scaffold. This tests the GitHub source CLI; it is **not a published npm registry package**.

## Feedback to request

- What did you expect before starting?
- Which command or concept first confused you?
- Could you describe how React, Zod, Express and Drizzle interact after finishing?
- What steps should be removed, automated or explained better?
- Would you recommend the project to another learner? Why or why not?
- Did you find any security/safety issues?

Use [GitHub Issues](https://github.com/SanamRai001/DevFoundation/issues) for non-sensitive feedback. A maintainer should triage and fix reproducible blockers before a stable release.

## Recommendation gate

Do not claim broad beginner readiness until at least **three independent first-time developers** have completed Task A and at least **two** have finished Task B without live maintainer intervention. These are a proposed internal acceptance threshold, not observed results. Record blockers, fix them, and retest.

Also verify the complete CLI from clean Windows and Ubuntu environments, real migrations/CRUD on disposable PostgreSQL, README links and MIT licensing.
