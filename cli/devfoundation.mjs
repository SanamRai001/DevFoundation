#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { cp, lstat, mkdtemp, mkdir, readFile, readdir, rename, rm, writeFile } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const foundationRoot = fileURLToPath(new URL('../', import.meta.url));
const templateEntries = [
  '.editorconfig', '.env.example', '.gitignore', '.prettierrc.json', 'AGENTS.md',
  'apps', 'LICENSE', 'eslint.config.mjs', 'package.json', 'package-lock.json', 'packages',
  'tsconfig.base.json',
];

function usage() {
  console.log([
    'DevFoundation — command-line project starter', '',
    '  npm run create -- <project-name> [--output <parent-dir>] [--database postgres]',
    '  npm run create -- <project-name> [--no-install] [--output <parent-dir>]',
    '  npm run doctor',
    '  npm run check',
    '  npm run dev', '',
    'No management website. React is the generated application starter.',
    'Existing directories are never overwritten; no GitHub repository is created.',
    'Use --output .. to create the new project alongside DevFoundation.',
    'PostgreSQL is opt-in; --database postgres requires dependency installation.',
  ].join('\n'));
}

function validateName(name) {
  if (!name || name.length > 60 || !/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(name)) {
    throw new Error('Project name must use 1–60 lowercase letters, numbers and hyphens, starting with a letter.');
  }
  if (/^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i.test(name)) {
    throw new Error('That project name is reserved on Windows.');
  }
  return name;
}

async function walkFiles(directory) {
  const items = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const item of items) {
    const path = join(directory, item.name);
    if (item.isDirectory()) files.push(...(await walkFiles(path)));
    else if (item.isFile()) files.push(path);
  }
  return files;
}

async function copyEntry(from, to) {
  if (!existsSync(from)) throw new Error('Missing starter entry: ' + basename(from));
  await cp(from, to, {
    recursive: true,
    force: false,
    errorOnExist: true,
    filter: async (path) => {
      if (['node_modules', 'dist', 'coverage', '.git'].includes(basename(path))) return false;
      return !(await lstat(path)).isSymbolicLink();
    },
  });
}

function generatedReadme(name) {
  return [
    '# ' + name, '',
    'A full-stack TypeScript project created with [DevFoundation](https://github.com/SanamRai001/DevFoundation).',
    'React + Vite frontend, Express API and Zod contracts in one npm workspace.', '',
    '## Start here', '',
    'Requires Node.js 24 LTS and npm. Dependencies were installed when this project was created unless you used --no-install.', '',
    '```powershell',
    'npm ci',
    'npm run check',
    'npm run dev',
    '```', '',
    'Open http://127.0.0.1:5173 (web) and http://127.0.0.1:3001/api/v1/health (API).',
    'Press Ctrl+C to stop the dev servers.', '',
    '## Edit your app', '',
    '- apps/web/src/App.tsx — replaceable React connection-demo page.',
    '- apps/api/src/app.ts — Express routes and error handling.',
    '- packages/contracts/src/index.ts — shared Zod response schemas and types.',
    '- docs/PROJECT_STATE.md — record the next feature and tests.', '',
    'Build a small complete UI + API feature and test both success and failure cases.', '',
    '## Commands', '',
    '- npm run dev — run frontend and API together.',
    '- npm run check — lint, typecheck, tests and build.',
    '- npm run test — run tests.',
    '- npm run build — compile production assets.',
    '- npm ci — install exactly from the lockfile.', '',
    '## Version control and security', '',
    'This project has no Git history by default; run git init -b main when ready.',
    'Keep secrets in untracked .env files. Authentication and production deployment are not included.', '',
    '## License and attribution', '',
    'Starter code comes from DevFoundation under the MIT License (see LICENSE).',
    'Keep the original copyright and license notice for reused starter portions.',
    'You may choose separate terms for your own additions where legally appropriate.', '',
  ].join('\n') + '\n';
}

const generatedCi = [
  'name: CI', '', 'on:', '  push:', '  pull_request:', '',
  'permissions:', '  contents: read', '',
  'jobs:', '  verify:', '    runs-on: ubuntu-latest', '    steps:',
  '      - uses: actions/checkout@v4', '      - uses: actions/setup-node@v4',
  '        with:', "          node-version: '24'", '          cache: npm',
  '      - run: npm ci --no-audit --no-fund',
  '      - run: npm run check', '',
].join('\n');

async function customize(target, name) {
  for (const file of await walkFiles(target)) {
    const content = await readFile(file, 'utf8');
    if (content.includes('@devfoundation/')) {
      await writeFile(file, content.replaceAll('@devfoundation/', '@' + name + '/'));
    }
  }
  const rootPath = join(target, 'package.json');
  const pkg = JSON.parse(await readFile(rootPath, 'utf8'));
  pkg.name = name;
  delete pkg.scripts.create;
  delete pkg.scripts.doctor;
  delete pkg.scripts['test:cli'];
  pkg.scripts.check = 'npm run lint && npm run typecheck && npm run test && npm run build';
  await writeFile(rootPath, JSON.stringify(pkg, null, 2) + '\n');

  const lockPath = join(target, 'package-lock.json');
  const lock = JSON.parse(await readFile(lockPath, 'utf8'));
  lock.name = name;
  lock.packages[''].name = name;
  await writeFile(lockPath, JSON.stringify(lock, null, 2) + '\n');

  await writeFile(join(target, 'README.md'), generatedReadme(name));
  await writeFile(join(target, 'AGENTS.md'), [
    '# Agent instructions', '',
    'Inspect repo, branch, docs, tests and architecture before major changes.',
    'Build small complete vertical slices with acceptance criteria and minimal accessible UX.',
    'Validate API boundaries, avoid secrets, test permissions and failure cases.',
    'Preserve unrelated work. Do not merge, delete branches or deploy without authorization.',
    'Provide verified results and exact PowerShell commands for expensive checks.',
    'Update docs/PROJECT_STATE.md at phase handoffs.', '',
  ].join('\n'));
  await mkdir(join(target, 'docs'));
  await mkdir(join(target, '.github', 'workflows'), { recursive: true });
  await writeFile(join(target, 'docs', 'ARCHITECTURE.md'), [
    '# Architecture — ' + name, '',
    '- apps/web: replaceable React + Vite UI',
    '- apps/api: Express API, structured errors, basic security',
    '- packages/contracts: shared Zod contracts and types',
    '- npm workspaces, strict TypeScript, automated checks and CI', '',
    'Add database, auth and deployment only when required.', '',
  ].join('\n'));
  await writeFile(join(target, 'docs', 'PROJECT_STATE.md'), [
    '# Project State — ' + name, '',
    '- Goal: Define product outcome and intended users.',
    '- Branch: Not initialized.',
    '- Phase: Scaffolded, not verified locally.',
    '- Changes: Generated through DevFoundation CLI.',
    '- Verification: Run npm run check, then manually test application.',
    '- Risks: Define security, data, and deployment requirements.',
    '- Next: Build first valuable end-to-end feature.', '',
  ].join('\n'));
  await writeFile(join(target, '.github', 'workflows', 'ci.yml'), generatedCi);
}

function parseCreateOptions(options) {
  let install = true;
  let output = process.cwd();
  let outputProvided = false;
  let database = 'none';
  let databaseProvided = false;
  for (let i = 0; i < options.length; i++) {
    const option = options[i];
    if (option === '--no-install') {
      if (!install) throw new Error('Duplicate --no-install option.');
      install = false;
    } else if (option === '--output') {
      if (outputProvided) throw new Error('Duplicate --output option.');
      const parent = options[++i];
      if (!parent || parent.startsWith('--')) {
        throw new Error('Missing directory after --output.');
      }
      output = resolve(parent);
      outputProvided = true;
    } else if (option === '--database') {
      if (databaseProvided) throw new Error('Duplicate --database option.');
      const value = options[++i];
      if (value !== 'postgres') throw new Error('Only --database postgres is supported.');
      database = value;
      databaseProvided = true;
    } else {
      throw new Error('Unknown option: ' + option);
    }
  }
  if (database === 'postgres' && !install) {
    throw new Error('--database postgres cannot use --no-install: dependency lockfile must be resolved. Use normal creation.');
  }
  return { install, output, database };
}


function runNpm(cwd, args) {
  const result = spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', args, {
    cwd, stdio: 'inherit', shell: process.platform === 'win32',
  });
  if (result.error || result.status !== 0) {
    throw new Error('npm ' + args[0] + ' failed; generated directory was not published.');
  }
}

async function addPostgres(target, name) {
  const source = join(foundationRoot, 'modules', 'postgres', 'api');
  const api = join(target, 'apps', 'api');
  await copyEntry(join(source, 'src', 'db'), join(api, 'src', 'db'));
  await copyEntry(join(source, 'drizzle.config.ts'), join(api, 'drizzle.config.ts'));
  await copyEntry(join(source, '.env.example'), join(api, '.env.example'));

  const packagePath = join(api, 'package.json');
  const pkg = JSON.parse(await readFile(packagePath, 'utf8'));
  Object.assign(pkg.dependencies, { 'drizzle-orm': '^0.45.2', pg: '^8.16.3', dotenv: '^17.2.0' });
  Object.assign(pkg.devDependencies, { 'drizzle-kit': '^0.31.10', '@types/pg': '^8.15.5' });
  pkg.scripts['db:generate'] = 'drizzle-kit generate --config=drizzle.config.ts';
  pkg.scripts['db:migrate'] = 'drizzle-kit migrate --config=drizzle.config.ts';
  await writeFile(packagePath, JSON.stringify(pkg, null, 2) + '\n');

  const appFile = join(api, 'src', 'app.ts');
  let app = await readFile(appFile, 'utf8');
  app = app.replace(
    "import helmet from 'helmet';",
    "import helmet from 'helmet';\nimport { registerDatabaseRoutes } from './db/routes.js';",
  ).replace(
    "  app.use((_req, res) => {",
    "  registerDatabaseRoutes(app);\n\n  app.use((_req, res) => {",
  );
  if (!app.includes('registerDatabaseRoutes(app)')) throw new Error('API app registration point changed.');
  await writeFile(appFile, app);

  const serverFile = join(api, 'src', 'server.ts');
  let server = await readFile(serverFile, 'utf8');
  server = "import 'dotenv/config';\n" + server;
  server = server.replace(
    "import { loadConfig } from './config.js';",
    "import { loadConfig } from './config.js';\nimport { getDatabaseUrl, closeDatabase } from './db/client.js';",
  ).replace(
    "const config = loadConfig();",
    "const config = loadConfig();\ngetDatabaseUrl();",
  ).replace(
    "  server.close((error) => {",
    "  server.close(async (error) => {\n    try { await closeDatabase(); } catch { process.exitCode = 1; }",
  );
  if (!server.includes('getDatabaseUrl();')) throw new Error('API server startup point changed.');
  await writeFile(serverFile, server);

  const ciPath = join(target, '.github', 'workflows', 'ci.yml');
  let ci = await readFile(ciPath, 'utf8');
  ci = ci.replace(
    '    runs-on: ubuntu-latest',
    [
      '    runs-on: ubuntu-latest',
      '    services:',
      '      postgres:',
      '        image: postgres:17',
      '        env:',
      '          POSTGRES_DB: foundation_test',
      '          POSTGRES_USER: postgres',
      '          POSTGRES_PASSWORD: postgres',
      '        ports:',
      '          - 5432:5432',
      '        options: >-',
      '          --health-cmd "pg_isready -U postgres"',
      '          --health-interval 5s',
      '          --health-timeout 5s',
      '          --health-retries 10',
      '    env:',
      '      DATABASE_URL: postgresql://postgres:postgres@127.0.0.1:5432/foundation_test',
      '      TEST_DATABASE_URL: postgresql://postgres:postgres@127.0.0.1:5432/foundation_test',
    ].join('\n'),
  ).replace(
    '      - run: npm run check',
    [
      '      - run: npm run db:generate -w @' + name + '/api',
      '      - run: npm run db:migrate -w @' + name + '/api',
      '      - run: npm run check',
    ].join('\n'),
  );
  if (!ci.includes('TEST_DATABASE_URL:')) throw new Error('Generated CI structure changed.');
  await writeFile(ciPath, ci);

  await writeFile(join(target, 'README.md'), (await readFile(join(target, 'README.md'), 'utf8')) + [
    '', '## PostgreSQL + Drizzle (opt-in)', '',
    'This project has the PostgreSQL module. PostgreSQL itself is not installed by the generator.',
    'Create a disposable local PostgreSQL database and copy apps/api/.env.example to apps/api/.env,',
    'then change DATABASE_URL to real local credentials. Do not commit credentials.',
    'Run: npm run db:generate -w @' + name + '/api',
    'Then: npm run db:migrate -w @' + name + '/api',
    'Commit the generated apps/api/drizzle migration files before deployment.',
    'Run: npm run dev (API starts only if DATABASE_URL is configured).',
    'GET /api/v1/db/health tests connectivity without leaking connection details.',
    'For real integration tests use TEST_DATABASE_URL pointing to a disposable, migrated test DB.',
    'NEVER point TEST_DATABASE_URL at production. CI provisions its own temporary PostgreSQL instance.',
    'The sample_notes schema is a learning example; replace it before building real domain features.',
  ].join('\n') + '\n');
  await writeFile(join(target, 'docs', 'PROJECT_STATE.md'),
    (await readFile(join(target, 'docs', 'PROJECT_STATE.md'), 'utf8')) +
    '\n- Database: PostgreSQL + Drizzle opt-in. First migration generation and apply required.\n');

  console.log('Enabled optional PostgreSQL + Drizzle module.');
}

async function createProject(name, options) {
  validateName(name);
  const { install, output, database } = parseCreateOptions(options);
  let parent;
  try {
    parent = await lstat(output);
  } catch {
    throw new Error('Output parent directory does not exist: ' + output);
  }
  if (!parent.isDirectory()) {
    throw new Error('Output parent must be a real directory: ' + output);
  }
  const destination = join(output, name);
  if (existsSync(destination)) {
    throw new Error('Target already exists; no files changed: ' + destination);
  }
  const staging = await mkdtemp(join(output, '.' + name + '-foundation-'));
  let published = false;
  try {
    for (const entry of templateEntries) {
      await copyEntry(join(foundationRoot, entry), join(staging, entry));
    }
    await customize(staging, name);
    if (database === 'postgres') {
      await addPostgres(staging, name);
      // Re-resolve only this generated project's optional dependencies.
      runNpm(staging, ['install', '--package-lock-only', '--ignore-scripts', '--no-audit', '--no-fund']);
    }
    if (existsSync(destination)) {
      throw new Error('Target appeared during generation; refusing to overwrite: ' + destination);
    }
    await rename(staging, destination);
    published = true;
  } finally {
    if (!published) await rm(staging, { recursive: true, force: true });
  }
  if (install) {
    try {
      console.log('Installing dependencies with npm ci...');
      // Windows npm workspace junctions use absolute paths: install only after final rename.
      runNpm(destination, ['ci', '--no-audit', '--no-fund']);
    } catch (error) {
      // A failed fresh scaffold is removed; existing folders are never touched.
      await rm(destination, { recursive: true, force: true });
      throw error;
    }
  }
  console.log('\nCreated ' + destination);
  console.log('\nNext:\n  cd ' + name + '\n  npm run check\n  npm run dev');
}

async function doctor() {
  let valid = true;
  if (Number(process.versions.node.split('.')[0]) !== 24) {
    console.error('FAIL Requires Node.js 24 LTS, found ' + process.version);
    valid = false;
  } else console.log('PASS Node.js ' + process.version);
  for (const entry of ['package.json', 'package-lock.json', 'apps/api', 'apps/web', 'packages/contracts']) {
    if (existsSync(join(foundationRoot, entry))) console.log('PASS ' + entry);
    else { console.error('FAIL Missing ' + entry); valid = false; }
  }
  if (!valid) process.exitCode = 1;
  console.log('Use npm run check for lint, types, tests and builds.');
}

async function main() {
  const [command, ...args] = process.argv.slice(2);
  if (!command || command === '--help' || command === 'help') usage();
  else if (command === 'doctor' && args.length === 0) await doctor();
  else if (command === 'create' && args.length === 1 && args[0] === '--help') usage();
  else if (command === 'create') await createProject(args[0], args.slice(1));
  else throw new Error('Unknown command. Run npm run create -- --help for usage.');
}

main().catch((error) => {
  console.error('ERROR ' + (error instanceof Error ? error.message : String(error)));
  process.exitCode = 1;
});
