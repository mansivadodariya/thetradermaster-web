// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('TraderMaster Localization & Navigation Tests', () => {
  test('should render home page and check brand title', async ({ page }) => {
    await page.goto('/');
    // Check page title contains TraderMaster
    await expect(page).toHaveTitle(/TRADERMASTER|Trader Master/i);
  });

  test('should check about-us page loads', async ({ page }) => {
    await page.goto('/about-us');
    await expect(page).toHaveURL(/.*about-us/);
  });

  test('should check affiliate page loads', async ({ page }) => {
    await page.goto('/affiliate-program');
    await expect(page).toHaveURL(/.*affiliate-program/);
  });
});
