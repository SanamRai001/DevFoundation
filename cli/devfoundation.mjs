#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { cp, lstat, mkdtemp, mkdir, readFile, readdir, rename, rm, writeFile } from 'node:fs/promises';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const foundationRoot = fileURLToPath(new URL('../', import.meta.url));
const templateEntries = [
  '.editorconfig', '.env.example', '.gitignore', '.prettierrc.json', 'AGENTS.md',
  'apps', 'eslint.config.mjs', 'package.json', 'package-lock.json', 'packages',
  'tsconfig.base.json',
];

function usage() {
  console.log([
    'DevFoundation — command-line project starter', '',
    '  npm run create -- <project-name> [--no-install]',
    '  npm run doctor',
    '  npm run check',
    '  npm run dev', '',
    'No management website. React is the generated application starter.',
    'Existing directories are never overwritten; no GitHub repository is created.',
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
    'Generated from DevFoundation. Replace the example React status screen with real features.', '',
    'Requires Node.js 24 LTS and npm.', '',
    'Start: npm ci, then npm run dev.',
    'Verify: npm run check.', '',
    'Frontend: http://127.0.0.1:5173',
    'API health: http://127.0.0.1:3001/api/v1/health', '',
    'This project has no Git history. Run git init -b main if desired.',
    'Never commit secrets. Plan small vertical slices and keep docs/PROJECT_STATE.md current.',
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

async function createProject(name, options) {
  validateName(name);
  if (options.some((arg) => arg !== '--no-install') || options.length > 1) {
    throw new Error('Unknown or duplicate flag. Supported: --no-install');
  }
  const destination = resolve(process.cwd(), name);
  if (existsSync(destination)) {
    throw new Error('Target already exists; no files changed: ' + destination);
  }
  const staging = await mkdtemp(join(dirname(destination), '.' + name + '-foundation-'));
  let published = false;
  try {
    for (const entry of templateEntries) {
      await copyEntry(join(foundationRoot, entry), join(staging, entry));
    }
    await customize(staging, name);
    if (existsSync(destination)) {
      throw new Error('Target appeared during generation; refusing to overwrite: ' + destination);
    }
    await rename(staging, destination);
    published = true;
  } finally {
    if (!published) await rm(staging, { recursive: true, force: true });
  }
  console.log('\nCreated ' + destination);
  if (!options.includes('--no-install')) {
    console.log('Installing dependencies with npm ci...');
    const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    const result = spawnSync(npm, ['ci', '--no-audit', '--no-fund'], {
      cwd: destination, stdio: 'inherit', shell: process.platform === 'win32',
    });
    if (result.error || result.status !== 0) {
      throw new Error('Scaffold created, but install failed. Run npm ci inside the new folder.');
    }
  }
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
