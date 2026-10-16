# Build a real Notes app with DevFoundation

**Time needed:** Work through at your own pace. **Audience:** Comfortable with basic JavaScript; new to React + APIs + PostgreSQL. This tutorial builds a genuine React → HTTP → Express → Zod → Drizzle → PostgreSQL flow.

You will learn why each file exists, how data travels, how to change a feature, and how to prove it works. You won't need a deployment or any cloud account.

## 0. Try the application without installing a database

Start with a real React → Express → Zod application using temporary in-memory storage:

```powershell
npx --yes github:SanamRai001/DevFoundation beginner-notes --example notes
cd beginner-notes
npm run dev
```

Open http://127.0.0.1:5173 and create, complete and delete notes. This is **a real HTTP API**, but all note data is stored only in memory: it disappears when the API stops or restarts. There is no PostgreSQL, migration, authentication or hosted service. This is safe only for local learning—do not deploy this unprotected notes API publicly.

Inspect `apps/api/src/notes-memory-routes.ts`, `apps/api/src/notes-memory.test.ts`, `packages/contracts/src/index.ts` and `apps/web/src/App.tsx`. Once you understand the request flow, create a **separate project** with PostgreSQL using the following section. Do not simply add a `.env` to the memory starter and expect automatic migration.

## 1. Generate a PostgreSQL-backed working example

Install **Node.js 24**, Git and a **local PostgreSQL server** first. Clone DevFoundation:

```powershell
git clone https://github.com/SanamRai001/DevFoundation.git
cd DevFoundation
npm ci
npm run create -- learning-notes --output .. --database postgres --example notes
cd ../learning-notes
```

This generates an independent project, with its own `package.json`, code and tests. The `--example notes` flag also works without `--database postgres`, in which case notes use temporary in-memory storage; ordinary DevFoundation projects still use the simple API-connectivity demo. The generator installs npm dependencies, but **does not install PostgreSQL or create your database**.

### No-clone alternative

After installing Node.js 24 and Git, you can generate this exact example directly from the public GitHub source without cloning DevFoundation first:

```powershell
npx --yes github:SanamRai001/DevFoundation learning-notes --database postgres --example notes
cd learning-notes
```

This is a source-based GitHub runner, **not** a registry-published `npx create-devfoundation` package. You should review the code you're asking `npx` to execute. The local clone workflow above is also supported.

## 2. Understand the moving pieces

```text
Browser                          Server                       Database
apps/web/src/App.tsx
    | JSON via fetch('/api/v1/notes')
    v
Vite dev proxy -> Express apps/api/src/app.ts
                         |
                         v
                db/notes-routes.ts
                 |             |
                 v             v
            Zod contracts   Drizzle ORM -> PostgreSQL notes table
                         |
                         v
                      JSON reply -> React state -> visible list
```

- **`apps/web/src/App.tsx`** displays the UI, sends API calls with `fetch`, and shows loading/errors.
- **`apps/api/src/app.ts`** assembles middleware and routes; the Notes route is registered here.
- **`apps/api/src/db/notes-routes.ts`** handles GET, POST, PATCH and DELETE for notes, validates inputs and queries the DB.
- **`packages/contracts/src/index.ts`** contains shared Zod schemas: a runtime validator and its TypeScript type come from the same declaration.
- **`apps/api/src/db/schema.ts`** defines the actual `notes` SQL table via Drizzle.
- **`apps/api/drizzle/`** holds generated SQL migration files, after you generate them.
- **`apps/api/src/notes.test.ts`** proves invalid requests are rejected and, with a disposable DB, that real HTTP CRUD works.

The key advantage of shared contracts is that the frontend and backend validate data consistently rather than each guessing about the JSON shape.

## 3. Configure your local database

Create **an empty development PostgreSQL database** called `learning_notes` using a tool such as `psql`, your local PostgreSQL administration UI, or your provider's management console. Use a dedicated development account with access only to that database.

Copy the safe example configuration:

```powershell
Copy-Item .\apps\api\.env.example .\apps\api\.env
notepad .\apps\api\.env
```

Update `DATABASE_URL` with your own development username, password, host, port and database name, for example `postgresql://dev:YOUR_LOCAL_PASSWORD@127.0.0.1:5432/learning_notes`. This example is **not** a credential you should copy unchanged. Never commit `.env` or real database passwords. Special characters in URLs need proper percent-encoding.

Create versioned SQL from the Drizzle schema and inspect the new file before applying it:

```powershell
npm run db:generate -w @learning-notes/api
npm run db:migrate -w @learning-notes/api
npm run check
npm run dev
```

Open **http://127.0.0.1:5173**. Add a note, complete it, delete it, and refresh. Notes persist in PostgreSQL until deleted. The backend runs on port 3001 behind Vite's `/api` proxy. The schema also contains the original `sample_notes` learning table; you may remove it later once you understand migrations.

## 4. Trace one operation: creating a note

1. Type `Learn Zod` and choose **Add note**.
2. React's `add` handler validates `{ title: 'Learn Zod' }` with `createNoteSchema.safeParse`. Empty/long titles are rejected locally.
3. `fetch` sends `POST /api/v1/notes` with JSON. React never imports database credentials.
4. Express receives the request, and `notes-routes.ts` independently validates `req.body` using the **same Zod schema**. Server-side validation is essential; browsers can be bypassed.
5. Drizzle runs a parameterized INSERT into PostgreSQL. The database returns the new row.
6. The server responds with HTTP **201** and a JSON note containing `id`, `title` and `completed`.
7. React validates the response with `noteSchema`, loads the new list and re-renders.

Marking a note complete sends `PATCH /api/v1/notes/:id` with a real Boolean; deleting sends `DELETE` and expects HTTP 204. Invalid IDs or payloads return HTTP 400; missing notes return 404.

## 5. Make a real change yourself

**Exercise: change the maximum note title length from 120 to 80 characters.** Do this in two places for two separate reasons:

- `packages/contracts/src/index.ts` — update `createNoteSchema.max(120)` to `.max(80)`; this validates incoming values in React and Express.
- `apps/api/src/db/schema.ts` — change the notes table `varchar(... length: 120)` to `length: 80`; this limits storage in PostgreSQL.

Also adjust the web input's `maxLength` from 120 to 80 in `apps/web/src/App.tsx`, and the error message in `apps/api/src/db/notes-routes.ts`. Update your tests from a 121-character invalid title to 81 characters.

Generate a migration **and read it** before applying. Narrowing columns may fail when longer existing values are present; for learning, use an empty/disposable database or migrate safely after examining the data. Then run:

```powershell
npm run db:generate -w @learning-notes/api
npm run db:migrate -w @learning-notes/api
npm run check
```

Restart `npm run dev` if you changed contracts and the watcher hasn't rebuilt them.

## 6. Test beyond the happy path

`npm run check` runs lint, strict TypeScript, tests and a full build, without requiring a test DB for basic checks.

To test **real database CRUD** without risking your development data, create a **separate disposable test database**, apply the migrations to that test database, and set `TEST_DATABASE_URL` only for the test process. The test uses that URL to create, retrieve, update, and delete a temporary note. Never point `TEST_DATABASE_URL` at production or at a database containing data you care about.

GitHub CI already runs this database round-trip against a temporary PostgreSQL instance; it also generates both ordinary and Notes-enabled projects on Ubuntu/Windows.

You should also manually try an empty title, stopping the API while the web app is open, refreshing after creation, and requesting a nonexistent note ID. The UI should not silently claim success if the server is unavailable.

## 7. What this example deliberately excludes

**It has no user accounts or permission isolation**: every visitor to a running instance can access the same notes. It is suitable for **local learning only**. Don't put personal notes into a publicly exposed instance. Before turning it into a real product, add authentication, ownership checks, rate limiting, backups, monitoring, and deployment protection.

## 8. Show what you learned

Make one feature change and explain it in a pull request or `docs/PROJECT_STATE.md`: what changed, why each file changed, how the request flows, and which tests you ran. That is stronger evidence of understanding than simply installing a boilerplate.

[Back to README](../README.md) · [Contributing](../CONTRIBUTING.md)
