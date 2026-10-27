// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('TraderMaster AI Intelligence & Trading Suites', () => {
  test.beforeEach(async ({ context, page }) => {
    await context.addCookies([
      { name: 'auth_token', value: 'mock_jwt_token_tradermaster', domain: 'localhost', path: '/' }
    ]);
    await page.addInitScript(() => {
      window.localStorage.setItem('has_seen_welcome_modal', 'true');
      window.localStorage.setItem('tradermaster_welcome_dismissed', 'true');
    });
  });

  test('1. AI Chart Scanner / TradeSnap: rendering and upload zone', async ({ page }) => {
    await page.goto('/ai-chart-scanner', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/.*(chart-scanner|signal-terminal)/);
  });

  test('2. AI Trade Advisor / Copilot: prompt interface and chat panel', async ({ page }) => {
    await page.goto('/ai-trade-advisor', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/.*trade-advisor/);
  });

  test('3. AI Trade Audit / Past Trade Analyzer: cockpit interface', async ({ page }) => {
    await page.goto('/ai-trade-audit', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/.*(trade-audit|trade-advisor)/);
  });

  test('4. AI Strategy Hub & Predefined Strategies', async ({ page }) => {
    await page.goto('/predefined-strategies', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/.*(predefined-strategies|strategy-core|trading-signal)/);
  });

  test('5. Custom Bot Builder: strategy creation studio', async ({ page }) => {
    await page.goto('/custom-bot-builder', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/.*bot-builder/);
  });

  test('6. My Bots & Library', async ({ page }) => {
    await page.goto('/my-bots', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/.*(my-bots|bot-library)/);
  });
});
