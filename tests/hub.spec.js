import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const dataSrc = readFileSync('public/assets/js/data.js', 'utf8');
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(dataSrc, ctx);
const D = ctx.window.MILCITY_DATA;

const ROUTES = ['home', 'tools', 'training', 'org', 'rules'];
const people = [];
(function walk(p) { people.push(p); if (p.partner) walk(p.partner); (p.children || []).forEach(walk); })(D.ORG);

const gotoRoute = async (page, route) => {
  await page.goto(`/#${route}`);
  await expect(page.locator(`.page[data-page="${route}"]`)).toHaveClass(/active/);
};

test.describe('links', () => {
  test('every tool card href matches data.js and opens safely', async ({ page }) => {
    await gotoRoute(page, 'tools');
    for (const t of D.TOOLS) {
      const link = page.locator(`#tool-${t.id}`).locator('a.btn').first();
      await expect(link).toHaveAttribute('href', t.url);
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
    expect(D.TOOLS).toHaveLength(8);
  });

  test('OTC List and GLP-1 List show "To be updated"', async ({ page }) => {
    await gotoRoute(page, 'tools');
    for (const id of ['otc', 'glp']) {
      await expect(page.locator(`#tool-${id}`)).toContainText('To be updated');
    }
  });
});

test.describe('org chart', () => {
  test('7 people with correct roles', async ({ page }) => {
    await gotoRoute(page, 'org');
    await expect(page.locator('#tree .person')).toHaveCount(7);
    const roles = await page.locator('#tree .person .who > span:not(.tag-new)').allTextContents();
    expect(roles.filter(r => r === 'Owner' || r === 'Co-Owner')).toHaveLength(2);
    expect(roles.filter(r => r === 'Operations Manager (OM)')).toHaveLength(1);
    expect(roles.filter(r => r === 'Sales Representative')).toHaveLength(4);
  });

  test('each drawer email and phone match data.js', async ({ page }) => {
    await gotoRoute(page, 'org');
    for (const p of people) {
      await page.locator('#tree .person', { hasText: p.name }).first().click();
      const drawer = page.locator('#person');
      await expect(drawer).toContainText(p.name);
      const mail = drawer.locator('a[href^="mailto:"]');
      const tel = drawer.locator('a[href^="tel:"]');
      if (p.email) await expect(mail.first()).toHaveAttribute('href', `mailto:${p.email}`);
      else await expect(mail).toHaveCount(0);
      if (p.phone) await expect(tel.first()).toHaveAttribute('href', 'tel:' + p.phone.replace(/[^\d+]/g, ''));
      else await expect(tel).toHaveCount(0);
      await page.keyboard.press('Escape');
    }
  });
});

test.describe('privacy and brand', () => {
  const banned = /Novaliches|Marikina|Cabatuan|Cainta|Apolonio/i;
  const birthYear = /\b(19[4-9]\d|200\d)\b/;

  test('no address words in data.js; new birthdays are month and day only', () => {
    expect(dataSrc).not.toMatch(banned);
    // Anyone listed in the org chart other than the two owners stores month and day only.
    for (const p of people.filter(x => x.role !== 'Owner' && x.role !== 'Co-Owner')) {
      expect(p.birthday, p.name).not.toMatch(birthYear);
    }
  });

  test('no address words or birth years on any page', async ({ page }) => {
    for (const r of ROUTES) {
      await gotoRoute(page, r);
      if (r === 'org') {
        for (const p of people) {
          await page.locator('#tree .person', { hasText: p.name }).first().click();
          const text = await page.locator('#person').innerText();
          expect(text, p.name).not.toMatch(banned);
          expect(text, p.name).not.toMatch(birthYear);
          await page.keyboard.press('Escape');
        }
      }
      const text = await page.locator('body').innerText();
      expect(text).not.toMatch(banned);
      expect(text).not.toMatch(birthYear);
    }
  });

  test('no visible EMS or East Med text', async ({ page }) => {
    for (const r of ROUTES) {
      await gotoRoute(page, r);
      const text = await page.locator('body').innerText();
      expect(text).not.toMatch(/\bEMS\b/);
      expect(text).not.toMatch(/East\s*Med/i);
    }
  });
});

test.describe('layout', () => {
  for (const width of [375, 768, 1024]) {
    test(`no horizontal scroll at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      for (const r of ROUTES) {
        await gotoRoute(page, r);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect(overflow, `route ${r}`).toBeLessThanOrEqual(0);
      }
    });
  }

  test('one h1 per active page', async ({ page }) => {
    for (const r of ROUTES) {
      await gotoRoute(page, r);
      await expect(page.locator('.page.active h1')).toHaveCount(1);
    }
  });
});

test.describe('keyboard', () => {
  test('Ctrl+K opens search, Escape closes it, focus returns', async ({ page }) => {
    await gotoRoute(page, 'home');
    await page.locator('#findBtn').focus();
    await page.keyboard.press('Control+k');
    await expect(page.locator('#palette')).toHaveClass(/open/);
    await expect(page.locator('#palQ')).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(page.locator('#palette')).not.toHaveClass(/open/);
    await expect(page.locator('#findBtn')).toBeFocused();
  });

  test('mobile menu opens and closes by keyboard', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await gotoRoute(page, 'home');
    const btn = page.locator('#menuBtn');
    await btn.focus();
    await page.keyboard.press('Enter');
    await expect(btn).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#side')).toHaveClass(/open/);
    await page.keyboard.press('Escape');
    await expect(btn).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#side')).not.toHaveClass(/open/);
    await expect(btn).toBeFocused();
  });
});

test.describe('theme', () => {
  test('ems-hub:theme=dark applies data-theme="dark"', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('ems-hub:theme', 'dark'));
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });
});

test.describe('accessibility', () => {
  for (const theme of ['light', 'dark']) {
    test(`axe: no serious or critical violations (${theme})`, async ({ page }) => {
      await page.addInitScript(t => localStorage.setItem('ems-hub:theme', t), theme);
      for (const r of ROUTES) {
        await gotoRoute(page, r);
        await page.waitForTimeout(400); // let page transitions settle
        const { violations } = await new AxeBuilder({ page }).analyze();
        const bad = violations.filter(v => v.impact === 'serious' || v.impact === 'critical');
        expect(bad.map(v => `${v.id}: ${v.nodes.map(n => n.target).join(' | ')}`), `route ${r}`).toEqual([]);
      }
    });
  }
});
