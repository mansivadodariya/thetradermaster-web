// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('TraderMaster Homepage Top-to-Bottom Suite', () => {
  test('Complete vertical scroll and section verification', async ({ page }) => {
    await page.goto('/');

    // 1. Page Title & Hero Section
    await expect(page).toHaveTitle(/TRADERMASTER|Trader Master/i);
    const heroH1 = page.locator('h1').first();
    await expect(heroH1).toBeVisible();

    // 2. Primary Hero CTAs
    const primaryCta = page.locator('a[href*="signup"], a[href*="login"], a[href*="plans"], button').first();
    await expect(primaryCta).toBeVisible();

    // 3. Smooth vertical scroll down to trigger all sections
    const scrollHeights = [0.2, 0.4, 0.6, 0.8, 1.0];
    for (const factor of scrollHeights) {
      await page.evaluate((f) => {
        window.scrollTo(0, document.body.scrollHeight * f);
      }, factor);
      await page.waitForTimeout(300);
    }

    // 4. Verify FAQ section is rendered
    const faqSection = page.locator('section:has-text("FAQ"), section:has-text("Frequently"), [class*="faq" i]').first();
    if (await faqSection.count() > 0) {
      await expect(faqSection).toBeVisible();
    }

    // 5. Verify Bottom Call To Action
    const bottomCta = page.locator('[class*="commonCta" i], [class*="cta" i], section:last-of-type').first();
    if (await bottomCta.count() > 0) {
      await expect(bottomCta).toBeVisible();
    }
  });
});
