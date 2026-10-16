# DevFoundation

[![CI](https://github.com/SanamRai001/DevFoundation/actions/workflows/ci.yml/badge.svg)](https://github.com/SanamRai001/DevFoundation/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**A beginner-friendly, open-source TypeScript full-stack starter CLI.** Create a React + Vite frontend, an Express API, and shared Zod types with testing and CI already configured. Add **PostgreSQL + Drizzle ORM only when you need a database**.

If you've ever wondered *"how do I start a full-stack TypeScript project without setting everything up again?"*, this repository is for you.

No DevFoundation management dashboard. No account needed. No generator package to publish or install globally.

## Start in a few commands

**You need:** [Node.js 24 LTS](https://nodejs.org/en/download) (includes npm), [Git](https://git-scm.com/downloads), and a terminal (PowerShell, macOS or Linux). You don't need PostgreSQL for the default starter.

Clone DevFoundation **once**:

```powershell
git clone https://github.com/SanamRai001/DevFoundation.git
cd DevFoundation
node --version
npm ci
```

Create your first project next to the cloned repository:

```powershell
npm run create -- hello-world --output ..
cd ../hello-world
npm run check
npm run dev
```

Open **http://127.0.0.1:5173** in your browser. The example page should report that the API is connected. The API health endpoint is **http://127.0.0.1:3001/api/v1/health**. Press **Ctrl+C** in the terminal to stop the development servers.

> The generator uses the source code in your clone. To get newer improvements later, update your DevFoundation checkout before creating another project. Don't run `npm run create` from an already-generated app.

For more step-by-step help (including Windows setup and troubleshooting), read **[Your first project](docs/GETTING_STARTED.md)**.

## Choose your starter

| You want to build… | Command (run inside DevFoundation) | What gets created |
| --- | --- | --- |
| A simple web + API app | `npm run create -- my-app --output ..` | React, Vite, Express, TypeScript, Zod, tests, CI |
| An app with a PostgreSQL database | `npm run create -- my-app --output .. --database postgres` | Everything above **plus** Drizzle ORM, PostgreSQL configuration and migration tooling |

The database option does **not** install or host PostgreSQL for you. It creates code and commands that work with a PostgreSQL database you supply. See [Database setup](docs/GETTING_STARTED.md#optional-postgresql-and-drizzle).

You can also run `npm run create -- my-app` to create the project **inside the current directory**, or use `--output "D:\Projects"` to select an existing parent directory. Names must use lowercase letters, digits, and hyphens (for example, `study-planner`). Existing target folders are never overwritten.

### What does the generated app contain?

```text
my-app/
├── apps/
│   ├── web/                 React 19 + Vite example UI
│   └── api/                 Express 5 API, safe error responses
├── packages/
│   └── contracts/           Shared Zod schemas and TypeScript types
├── .github/workflows/       GitHub Actions checks
├── docs/                    Architecture and project state
├── LICENSE                  MIT notice for starter code
└── package.json             One-command scripts using npm workspaces
```

When you opt in to PostgreSQL, the API also receives `src/db/`, `drizzle.config.ts`, migration commands and database test wiring. No database dependencies are added to the default starter.

The generated React screen is a **replaceable API connectivity demo**, not a finished product UI.

## Everyday commands

Run the following from **your generated project**:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the frontend and API together |
| `npm run check` | Run lint, TypeScript checks, tests and production builds |
| `npm run lint` | Check code linting |
| `npm run test` | Run API and frontend tests |
| `npm run build` | Make production build outputs |
| `npm ci` | Reinstall dependencies from the committed lockfile |

Commands available only from the **DevFoundation repository**: `npm run create -- <name>`, `npm run doctor` and `npm run test:cli`.

### Where to begin coding

- Change **`apps/web/src/App.tsx`** to build your first screen.
- Add or replace API routes in **`apps/api/src/app.ts`**.
- Define shared request/response validation in **`packages/contracts/src/index.ts`**.
- Build one small end-to-end feature; update **`docs/PROJECT_STATE.md`** as you go.

See the [beginner walkthrough](docs/GETTING_STARTED.md) for an example development journey.

## What this starter includes (and doesn't)

**Included:** strict TypeScript, npm workspaces, React/Vite, Express, Zod, health endpoint, input-size limits, basic security headers, testing, linting, CI, and optional PostgreSQL + Drizzle tooling.

**Not included:** accounts/authentication, permissions, hosting, production monitoring, automated backups, payment processing, or a full product UI. Those require project-specific design. This is a tested **starting point**, not a production-ready SaaS application.

The CLI copies starter files into a new independent folder, renames package identities, and installs dependencies with `npm ci`. It does **not** create GitHub repositories, push code, manage databases, or deploy applications. There is currently **no published `npx create-devfoundation` package**.

## Troubleshooting

- **`node` or `npm` is missing:** install Node.js 24 LTS and reopen your terminal. Check `node --version`.
- **A folder already exists:** choose a new project name. The CLI intentionally refuses to overwrite files.
- **Port 5173 or 3001 is already in use:** stop the other process using that port before running `npm run dev`.
- **The browser says the API is unavailable:** check that both dev processes are running, then refresh the page and use **Try again**.
- **PostgreSQL connection error:** the database-enabled starter needs a real database and correctly configured `apps/api/.env`; follow the [database guide](docs/GETTING_STARTED.md#optional-postgresql-and-drizzle).

More details: [Getting started and common problems](docs/GETTING_STARTED.md).

## For contributors and maintainers

Beginners and experienced developers are welcome. Start with [CONTRIBUTING.md](CONTRIBUTING.md) and the [issue tracker](https://github.com/SanamRai001/DevFoundation/issues). Read [architecture decisions](docs/ARCHITECTURE.md) and [current project state](docs/PROJECT_STATE.md) before larger changes.

Repository owner: [SanamRai001](https://github.com/SanamRai001). Maintainer metadata and project discoverability notes: [Maintainer checklist](docs/MAINTAINER_CHECKLIST.md).

## License

DevFoundation is released under the **[MIT License](LICENSE)**. You can use, modify, and distribute the starter, including commercially, as long as you keep the applicable copyright and license notice. The generated starter also includes that notice; your own new code can be licensed separately where appropriate. Dependencies have their own licenses.
