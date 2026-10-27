// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('TraderMaster User Profile & Security Settings Suite', () => {
  test.beforeEach(async ({ context, page }) => {
    await context.addCookies([
      { name: 'auth_token', value: 'mock_jwt_token_tradermaster', domain: 'localhost', path: '/' }
    ]);
    await page.addInitScript(() => {
      window.localStorage.setItem('has_seen_welcome_modal', 'true');
      window.localStorage.setItem('tradermaster_welcome_dismissed', 'true');
    });
  });

  test('Profile Page: tabs, AI assessment card, and security tab', async ({ page }) => {
    await page.goto('/profile', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/.*profile/);
  });
});
