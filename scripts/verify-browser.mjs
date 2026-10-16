import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

// CI-only: invoke from the DevFoundation checkout after installing browser tools.
const mode = process.argv[2];
const base = mode === 'memory' ? 'http://127.0.0.1:5173'
  : (process.env.PREVIEW_URL ?? new URL('../preview/index.html', import.meta.url).href);
if (!['memory','preview'].includes(mode)) throw new Error('Usage: node scripts/verify-browser.mjs memory|preview');
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1100, height: 850 } });
const page = await context.newPage();

try {
  await page.goto(base);
  await page.getByLabel('New note').fill('Understand Zod contracts');
  await page.getByRole('button', { name: /Add note/ }).click();
  await page.getByText('Understand Zod contracts').waitFor();
  // The real API responds asynchronously, so wait for React's server-backed
  // rerender rather than requiring checkbox state to flip in the click tick.
  await page.getByRole('checkbox').click();
  await page.waitForFunction(() => document.querySelector('input[type="checkbox"]')?.checked === true);
  assert.equal(await page.getByRole('checkbox').isChecked(), true);

  const accessibility = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  assert.equal(accessibility.violations.length, 0,
    'Accessibility violations:\n' + accessibility.violations.map(v => v.id + ': ' + v.nodes.map(n => n.target.join(' ') + ' (' + (n.failureSummary || '') + ')').join('; ')).join('\n'));

  await page.screenshot({ path: mode + '-notes-browser.png', fullPage: true });

  if (mode === 'memory') {
    await page.reload();
    await page.getByText('Understand Zod contracts').waitFor();
    assert.equal(await page.getByRole('checkbox').isChecked(), true, 'API process should retain notes through browser reload');
  }

  await page.getByRole('button', { name: 'Delete Understand Zod contracts' }).click();
  assert.equal(await page.getByText('Understand Zod contracts').count(), 0);

  if (mode === 'preview') {
    await page.getByLabel('New note').fill('Only in this browser');
    await page.getByRole('button', { name: /Add note/ }).click();
    await page.reload();
    assert.equal(await page.getByText('Only in this browser').count(), 0, 'Static sandbox must reset on refresh');
  } else {
    await page.route('**/api/v1/notes', route => route.abort());
    await page.reload();
    await page.getByRole('alert').waitFor();
    assert.match(await page.getByRole('alert').innerText(), /Cannot load notes/);
  }

  console.log(mode + ' browser CRUD, meaningful errors and WCAG A/AA axe checks passed.');
} finally {
  await page.close();
  await browser.close();
}
