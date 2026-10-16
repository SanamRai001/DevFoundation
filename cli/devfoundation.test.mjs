import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const cli = fileURLToPath(new URL('./devfoundation.mjs', import.meta.url));
function invoke(cwd, ...args) {
  return spawnSync(process.execPath, [cli, ...args], { cwd, encoding: 'utf8' });
}
async function inTempFolder(action) {
  const folder = await mkdtemp(join(tmpdir(), 'devfoundation-cli-test-'));
  try { await action(folder); }
  finally { await rm(folder, { recursive: true, force: true }); }
}

test('scaffolds a separately named full-stack project and lockfile', async () => {
  await inTempFolder(async (cwd) => {
    const result = invoke(cwd, 'create', 'sample-app', '--no-install');
    assert.equal(result.status, 0, result.stderr);
    const target = join(cwd, 'sample-app');
    const root = JSON.parse(await readFile(join(target, 'package.json'), 'utf8'));
    const lock = JSON.parse(await readFile(join(target, 'package-lock.json'), 'utf8'));
    const api = JSON.parse(await readFile(join(target, 'apps/api/package.json'), 'utf8'));
    const web = JSON.parse(await readFile(join(target, 'apps/web/package.json'), 'utf8'));
    const contracts = JSON.parse(await readFile(join(target, 'packages/contracts/package.json'), 'utf8'));
    assert.equal(root.name, 'sample-app');
    assert.equal(lock.name, 'sample-app');
    assert.equal(lock.packages[''].name, 'sample-app');
    assert.equal(api.name, '@sample-app/api');
    assert.equal(web.name, '@sample-app/web');
    assert.equal(contracts.name, '@sample-app/contracts');
    assert.equal(lock.packages['node_modules/@sample-app/contracts'].link, true);
    assert.ok(!lock.packages['node_modules/@devfoundation/contracts']);
    assert.equal(root.scripts.create, undefined);
    assert.ok(!root.scripts.check.includes('test:cli'));
    assert.match(await readFile(join(target, 'README.md'), 'utf8'), /sample-app/);
    assert.match(await readFile(join(target, 'LICENSE'), 'utf8'), /MIT License/);
    assert.match(await readFile(join(target, 'LICENSE'), 'utf8'), /Copyright \(c\) 2026 SanamRai001/);
    assert.match(await readFile(join(target, '.github/workflows/ci.yml'), 'utf8'), /npm ci/);
    assert.ok(!(await readdir(target)).includes('.git'));
    assert.ok(!(await readdir(target)).includes('cli'));
  });
});
test('rejects traversal and invalid Windows names with no files created', async () => {
  await inTempFolder(async (cwd) => {
    for (const bad of ['../other', 'Demo', 'two words', 'con', 'bad/path']) {
      assert.notEqual(invoke(cwd, 'create', bad, '--no-install').status, 0, bad);
    }
    assert.deepEqual(await readdir(cwd), []);
  });
});
test('will not overwrite existing projects', async () => {
  await inTempFolder(async (cwd) => {
    assert.equal(invoke(cwd, 'create', 'demo-app', '--no-install').status, 0);
    const before = await readdir(join(cwd, 'demo-app'));
    assert.notEqual(invoke(cwd, 'create', 'demo-app', '--no-install').status, 0);
    assert.deepEqual(await readdir(join(cwd, 'demo-app')), before);
  });
});
test('rejects unsupported flags and missing name', async () => {
  await inTempFolder(async (cwd) => {
    assert.notEqual(invoke(cwd, 'create').status, 0);
    assert.notEqual(invoke(cwd, 'create', 'demo-app', '--overwrite').status, 0);
    assert.notEqual(invoke(cwd, 'create', 'demo-app', '--no-install', '--no-install').status, 0);
    assert.notEqual(invoke(cwd, 'create', 'demo-app', '--output').status, 0);
    assert.notEqual(invoke(cwd, 'create', 'demo-app', '--output', '..', '--output', '..').status, 0);
    assert.notEqual(invoke(cwd, 'create', 'demo-app', '--output', join(cwd, 'missing')).status, 0);
    assert.deepEqual(await readdir(cwd), []);
  });
});

test('creates into an existing custom parent without modifying the working folder', async () => {
  await inTempFolder(async (cwd) => {
    const { mkdir } = await import('node:fs/promises');
    const parent = join(cwd, 'my projects');
    const launcher = join(cwd, 'launcher');
    await mkdir(parent);
    await mkdir(launcher);
    const result = invoke(launcher, 'create', 'new-product', '--output', parent, '--no-install');
    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(await readdir(launcher), []);
    const root = JSON.parse(await readFile(join(parent, 'new-product', 'package.json'), 'utf8'));
    assert.equal(root.name, 'new-product');
    assert.notEqual(invoke(launcher, 'create', 'new-product', '--no-install', '--output', parent).status, 0);
    assert.deepEqual(await readdir(parent), ['new-product']);
  });
});
test('database opt-in rejects invalid modes before touching the filesystem', async () => {
  await inTempFolder(async (cwd) => {
    for (const args of [
      ['create', 'app', '--database'],
      ['create', 'app', '--database', 'mysql'],
      ['create', 'app', '--database', 'postgres', '--no-install'],
      ['create', 'app', '--database', 'postgres', '--database', 'postgres'],
    ]) {
      const response = invoke(cwd, ...args);
      assert.notEqual(response.status, 0, args.join(' '));
    }
    assert.deepEqual(await readdir(cwd), []);
  });
});

test('plain generated starter remains database-free', async () => {
  await inTempFolder(async (cwd) => {
    const response = invoke(cwd, 'create', 'plain-product', '--no-install');
    assert.equal(response.status, 0, response.stderr);
    const packageData = JSON.parse(await readFile(join(cwd, 'plain-product', 'apps/api/package.json'), 'utf8'));
    assert.equal(packageData.dependencies['drizzle-orm'], undefined);
    assert.equal(packageData.scripts['db:migrate'], undefined);
    await assert.rejects(readFile(join(cwd, 'plain-product', 'apps/api/src/db/schema.ts'), 'utf8'));
  });
});

test('help does not create files', async () => {
  await inTempFolder(async (cwd) => {
    const r = invoke(cwd, '--help');
    assert.equal(r.status, 0);
    assert.match(r.stdout, /DevFoundation/);
    const createHelp = invoke(cwd, 'create', '--help');
    assert.equal(createHelp.status, 0);
    assert.match(createHelp.stdout, /npm run create/);
    assert.deepEqual(await readdir(cwd), []);
  });
});
