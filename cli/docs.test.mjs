import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const documents = [
  'README.md',
  'CONTRIBUTING.md',
  'docs/GETTING_STARTED.md',
  'docs/MAINTAINER_CHECKLIST.md',
];

test('beginner documentation contains accurate core commands and license', async () => {
  const readme = await readFile(join(root, 'README.md'), 'utf8');
  const license = await readFile(join(root, 'LICENSE'), 'utf8');
  assert.match(readme, /npm run create -- hello-world --output \.\./);
  assert.match(readme, /npm run create -- my-app --output \.\. --database postgres/);
  assert.match(readme, /not a production-ready/i);
  assert.match(license, /^MIT License/);
  assert.match(license, /THE SOFTWARE IS PROVIDED "AS IS"/);
});

test('all local Markdown links point to existing files', async () => {
  for (const filename of documents) {
    const source = await readFile(join(root, filename), 'utf8');
    const links = [...source.matchAll(/\]\(([^)]+)\)/g)].map((m) => m[1]);
    for (const raw of links) {
      const href = raw.split('#')[0];
      if (!href || /^(?:https?:|mailto:)/.test(href)) continue;
      const target = resolve(root, dirname(filename), decodeURIComponent(href));
      assert.ok(existsSync(target), filename + ' references missing file: ' + raw);
    }
  }
});
