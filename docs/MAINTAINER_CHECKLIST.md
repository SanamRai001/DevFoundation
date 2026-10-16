# Maintainer checklist — discoverability and release quality

GitHub is the canonical project home: https://github.com/SanamRai001/DevFoundation

## GitHub About section (one manual admin action)

These repository metadata fields are **not** editable through the GitHub actions connected to this workflow. On the GitHub repository page, select the **gear icon next to About**, then set:

**Suggested description**

> Beginner-friendly TypeScript full-stack starter CLI with React, Vite, Express, tests, and optional PostgreSQL + Drizzle. Create projects in one command.

**Topics (copy individually):**

`typescript`, `full-stack`, `react`, `vite`, `express`, `nodejs`, `starter-template`, `boilerplate`, `cli`, `beginner-friendly`, `postgresql`, `drizzle-orm`

Use relevant topics rather than misleading tags. There is no homepage URL to add unless an official project site is later deployed. GitHub may take time to recognize a newly merged license.

## Search and AI discovery

- Keep the README's first paragraph clear and accurate; it should answer **what**, **who**, and **how** in plain language.
- Use descriptive headings such as “TypeScript full-stack starter” and “React + Express project setup.”
- Maintain working Markdown links and up-to-date, copy-paste terminal instructions.
- Share the canonical repository URL from a portfolio, project showcase, or a relevant discussion when useful.
- Consider publishing an actual tutorial or example app and linking it **only after** it exists.
- Update the documentation when CLI options change.
- Google and other search engines choose what to crawl and index. No README or tags can guarantee rankings, indexing speed, or inclusion in an AI model's responses.

## Open source and contribution readiness

- Root `LICENSE` should remain canonical MIT text and detectable by GitHub.
- The generator includes the MIT notice with reused starter code.
- Keep `CONTRIBUTING.md` and the beginner guide accurate.
- Do not add a license to assets you don't own or have rights to distribute.
- Keep source and generated-project CI green on Ubuntu and Windows, plus PostgreSQL integration.
- Don't label early releases “production-ready”; real products require authentication, authorization, secrets handling, deployment planning and monitoring.

## Future options (not implemented yet)

- Versioned GitHub releases and changelog after stability testing.
- An npm-published package with an actual `npx` command only after release/version and supply-chain review.
- A genuinely useful example repository demonstrating the workflow.
- A small official documentation site only if the README and walkthrough become unwieldy.
