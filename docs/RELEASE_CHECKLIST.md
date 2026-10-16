# Release readiness — DevFoundation

## Current state

The repository has an MIT license and repeatable cross-platform CI. A Notes example and one-command GitHub-source installer are under review. **No stable v1.0, registry-published CLI, public demo video, or independently validated beginner release is claimed.**

## Technical release gates

- [ ] PR merged after green CI at exact head; independently verify the merged `main` SHA.
- [ ] Clean CI on Windows and Ubuntu: plain scaffold, PostgreSQL scaffold, Notes example.
- [ ] Disposable PostgreSQL test verifies migrations and POST/GET/PATCH/DELETE HTTP.
- [ ] `npx github:` source bootstrap verified on Windows and Ubuntu.
- [ ] Fresh machine manual browser walkthrough of Notes: create, refresh, complete, delete and network failures.
- [ ] Scan generated project for secrets, test data and unintended files.
- [ ] Audit and pin third-party dependency versions and any GitHub Action revisions as appropriate.
- [ ] README and walkthrough commands match release tag.
- [ ] Repository topics and description are accurate; documentation references resolve.
- [ ] MIT notices and third-party attribution reviewed.

## Community release gates

- [ ] Recruit independent testers as specified in [BETA_TESTING.md](BETA_TESTING.md).
- [ ] Document and resolve significant beginner friction reports.
- [ ] Capture **real** terminal video/screenshots of a successful current release, not a simulated demo.
- [ ] Publish support/bug-report guidance and maintain a public changelog.
- [ ] Choose version and compatibility support policy.

## Distribution and releases

There are **two distinct** distribution options:

1. **GitHub source CLI (currently implemented):** `npx --yes github:SanamRai001/DevFoundation my-app`. This runs current GitHub source and requires Node.js/Git. For reproducibility, pin a commit or tag.
2. **npm registry CLI (not yet published):** a future `create-devfoundation` package would need npm namespace ownership, review of the published tarball, an npm maintainer with 2FA, a publication workflow and release/version approval. Do not advertise `npx create-devfoundation` until its registry package exists and has been tested from outside the repo.

Recommend an initial **pre-release** before declaring stable. Release tags and notes should be created only from a reviewed `main` SHA after approval. No automatic deployment or registry publication should run on arbitrary pull requests.

## Security

The learning Notes example is unauthenticated and must not be publicly deployed as-is. Real products need permissions, monitoring and backups.

## F4 zero-database and public-preview gates

- [ ] Verify `--example notes` runs a full Express + React example without PostgreSQL, on Windows and Linux.
- [ ] Browser E2E exercises add, complete, refresh persistence, delete, and an API error in the real memory backend.
- [ ] Browser E2E verifies the static visitor demo resets on refresh and cannot contact an API.
- [ ] axe-core automated WCAG A/AA checks pass; human keyboard/screen-reader testing remains desirable.
- [ ] Public preview site serves **only** static HTML/CSS/JS and clearly labels simulation, with no external data storage.
- [ ] Preview URL and screenshots are linked only after successful reviewed deployment.
- [ ] Source-based GitHub one-command smoke test checks the current PR/head SHA, not an obsolete feature branch.
