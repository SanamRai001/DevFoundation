# Security policy

DevFoundation is a learning-oriented starter. It does not provide production authentication, authorization, rate limiting, backups or deployment hardening out of the box.

## Supported versions

The currently maintained branch is `main`; no stable supported release line is declared yet. Avoid assuming a guaranteed security update timeline.

## Reporting a vulnerability

**Do not publish security vulnerabilities, passwords, tokens or private data in GitHub Issues.** If the GitHub repository has private vulnerability reporting enabled, use **Security → Report a vulnerability** on the repository. Otherwise contact the maintainer through a suitable private channel linked from the GitHub profile. If no private channel is available, do not publish exploit details in a public issue.

Please include the affected revision, impact, reproducible steps and your preferred contact method without including real secrets.

## Important boundaries

- The Notes teaching example has **no authentication or user isolation**. Use it on a private local machine only.
- Database URL values and `.env` files must never be committed.
- Review each generated SQL migration before applying it; do not run tests against important databases.
- Running unpinned `npx github:` source executes the repository's current code. For reproducibility, prefer a reviewed commit or release tag.
- Dependency updates require testing, including new project generation on Windows and Ubuntu.
