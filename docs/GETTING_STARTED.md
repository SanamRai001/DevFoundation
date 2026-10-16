# Your first project with DevFoundation

This beginner guide shows how to go from a fresh computer to a working **React + Express + TypeScript** full-stack project using the DevFoundation CLI. You don't need an account, a database, or Docker for the basic project.

## Step 1: Check what you need

Install [Node.js 24 LTS](https://nodejs.org/en/download) and [Git](https://git-scm.com/downloads). Open **PowerShell** (Windows) or a terminal (macOS/Linux).

```powershell
node --version
npm --version
git --version
```

The Node version should start with `v24.`. npm comes with Node. You do not need an editor just to generate a project; [Visual Studio Code](https://code.visualstudio.com/) is an option for editing afterward.

## Step 2: Clone the starter

Choose a folder that you control, and run:

```powershell
git clone https://github.com/SanamRai001/DevFoundation.git
cd DevFoundation
npm ci
npm run doctor
```

`npm ci` installs the dependencies exactly from the repository's lockfile. It may use network access. `npm run doctor` checks the starter and your Node version.

Already cloned DevFoundation? From the repository directory, run `git pull --ff-only` to get the latest changes, provided your local work is clean. Avoid discarding local changes.

## Step 3: Generate your own project

From **inside the DevFoundation repository**:

```powershell
npm run create -- my-first-app --output ..
```

The project will be created alongside DevFoundation. For example:

```text
Projects/
├── DevFoundation/          The generator, which you can reuse later
└── my-first-app/           Your new standalone project
```

The generator refuses to overwrite an existing folder. If the folder name is taken, try `my-second-app`. Project names use lowercase letters, numbers, and hyphens and must start with a letter.

### CLI options

| Flag | Meaning |
| --- | --- |
| `--output ..` | Create the project next to the DevFoundation folder |
| `--output "D:\Projects"` | Choose an existing parent directory on Windows |
| `--no-install` | Skip dependency installation (basic starter only; run `npm ci` afterward) |
| `--database postgres` | Add optional PostgreSQL + Drizzle support (requires installation) |

Run `npm run create -- --help` for usage. The output directory must exist and be a directory.

## Step 4: Run the application

```powershell
cd ../my-first-app
npm run check
npm run dev
```

You should see separate frontend and API processes. Visit:

- **Web app:** http://127.0.0.1:5173
- **API health JSON:** http://127.0.0.1:3001/api/v1/health

The sample page initially shows a connection check, then a success message if it can reach Express. To verify its error state, stop the development servers, run only the web workspace (`npm run dev -w @my-first-app/web`), refresh the page, then restart the API in another terminal (`npm run dev -w @my-first-app/api`) and press **Try again**. Stop processes with **Ctrl+C**.

## Step 5: Make your first change

Open `my-first-app` in an editor. The important files are:

- **`apps/web/src/App.tsx`:** the replaceable React demo screen.
- **`apps/web/src/styles.css`:** the frontend styles.
- **`apps/api/src/app.ts`:** the Express API routes.
- **`packages/contracts/src/index.ts`:** shared Zod response schemas and types.
- **`docs/PROJECT_STATE.md`:** a short note about what you're building.

Try changing the heading on the frontend. For a new API feature, define a contract and add the route, then connect the UI. Write a test for the happy path **and** for a failure path. This is called a small end-to-end *vertical slice*.

The shared contract workspace compiles to JavaScript. If you change contracts and a consumer doesn't pick up the update, stop and rerun `npm run dev`.

## Step 6: Start your own Git repository (optional)

The generated project has no inherited `.git` folder or Git history. Once you're happy with it, from the generated project directory:

```powershell
git init -b main
git add .
git commit -m "chore: initialize my project"
```

This only creates local Git history. Creating a remote GitHub repository and pushing are separate choices. Never commit `.env` files, access tokens or passwords.

## Optional: PostgreSQL and Drizzle

If your project needs a relational database, start **from the DevFoundation repository**:

```powershell
npm run create -- notes-api --output .. --database postgres
cd ../notes-api
```

You must install and run PostgreSQL separately or use an existing PostgreSQL instance. DevFoundation does **not** create databases, Docker containers, credentials, or hosted resources for you.

Set up a **development-only** database and put its URL in the API's local environment file. On Windows PowerShell:

```powershell
Copy-Item .\apps\api\.env.example .\apps\api\.env
notepad .\apps\api\.env
```

Change `DATABASE_URL` to a correct URL for your local database. Do **not** commit the `.env` file, and do not paste passwords into a public issue.

Generate a versioned SQL migration **after reviewing the example schema**:

```powershell
npm run db:generate -w @notes-api/api
```

Inspect the SQL in `apps/api/drizzle/` before applying it, then run:

```powershell
npm run db:migrate -w @notes-api/api
npm run check
npm run dev
```

Commit reviewed SQL migration files to your new project. The example `sample_notes` schema is for demonstration and should be replaced with your actual data model. The API includes `/api/v1/db/health` for development connectivity checks; remove or restrict this in environments where it would expose infrastructure information.

CI creates a disposable PostgreSQL database for integration tests. On your machine, only set `TEST_DATABASE_URL` to a **separate disposable test database** with the appropriate migrations applied; never set it to production. Plain `npm run check` runs the unit tests without connecting to a database if no test URL is configured.

## Common problems

**`npm` is not recognized:** Install Node.js 24, close and reopen your terminal, then check `node --version` and `npm --version`.

**npm installation fails:** Make sure your internet connection can reach the npm registry, and retry from the appropriate directory. Don't delete unrelated files.

**The new directory already exists:** The CLI doesn't overwrite. Choose another name, or move your existing project yourself only if you understand the consequences.

**The API connection screen shows an error:** Confirm `npm run dev` started both processes. Open the API health address directly. Check for ports already occupied by another local process.

**Port 5173/3001 is busy:** Stop the existing server first. The starter uses fixed local ports in the example Vite and Express configuration.

**`DATABASE_URL` missing:** Only database-enabled apps require it. Copy the example file to `apps/api/.env` and use real development credentials. Run database migration commands from the root using the `-w` workspace option shown above.

**PowerShell prevents running npm scripts:** Some Windows installations have script execution restrictions. Use `npm.cmd` to run npm commands, or consult your organization's approved PowerShell policy rather than weakening machine-wide security settings.

**Can I run `npx create-devfoundation`?** Not yet. This is a GitHub-hosted starter and local CLI, not a published npm package.

## What's next?

Replace the example UI with your product, build one complete feature, run `npm run check`, and record your progress in `docs/PROJECT_STATE.md`. For contributing improvements back to DevFoundation, see [CONTRIBUTING.md](../CONTRIBUTING.md). License terms: [MIT](../LICENSE).

## Follow a complete full-stack project

After learning the basic connectivity demo, follow the [Notes application tutorial](BUILD_A_NOTES_APP.md). It explains a real request from React through Zod, Express and Drizzle to PostgreSQL, plus an exercise and integration tests.

## Notes app with no PostgreSQL

Beginners can now start a working Express-backed Notes example without setting up a database:

```powershell
npx --yes github:SanamRai001/DevFoundation beginner-notes --example notes
cd beginner-notes
npm run dev
```

Your note operations go through a real Express HTTP API, but data is **temporary** and resets when the API process restarts. For persistent notes and migrations follow [the PostgreSQL Notes tutorial](BUILD_A_NOTES_APP.md#1-generate-a-postgresql-backed-working-example).
