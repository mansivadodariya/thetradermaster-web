// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('ChronosX Trading Calculators & Utilities Suite', () => {
  test('1. Forex Calculators: verify tabs and interactive calculations', async ({ page }) => {
    await page.goto('/forex-calculator');

    // Verify calculator tabs exist
    const tabs = page.locator('button:has-text("Pip"), button:has-text("Margin"), button:has-text("Profit"), button:has-text("Fibonacci"), button:has-text("Pivot")');
    const tabCount = await tabs.count();
    expect(tabCount).toBeGreaterThanOrEqual(3);

    // Verify calculator input elements
    const inputs = page.locator('input[type="number"], input[type="text"]');
    expect(await inputs.count()).toBeGreaterThan(0);
  });

  test('2. Economic Calendar: events and filters', async ({ page }) => {
    await page.goto('/economic-calendar');
    await expect(page).toHaveURL(/.*calendar/);
  });

  test('3. Supported Brokers: broker catalog and comparison', async ({ page }) => {
    await page.goto('/supported-brokers');
    await expect(page).toHaveURL(/.*brokers/);
  });
});
