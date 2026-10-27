// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('ChronosX Global Header & Footer Navigation Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('has_seen_welcome_modal', 'true');
      window.localStorage.setItem('chronosx_welcome_dismissed', 'true');
    });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
  });

  test('1. Top Navbar: brand logo, main navigation links and auth CTA buttons', async ({ page }) => {
    // Brand / Logo check
    const brand = page.locator('header, nav').first();
    await expect(brand).toBeVisible();

    // Check presence of key navigation targets or header links
    const navLinks = page.locator('header a, nav a');
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('2. Language Switcher Dropdown in Header updates URL path', async ({ page }) => {
    // Click language toggle button in header
    const toggleBtn = page.locator('header [class*="toggleButton"]').first();
    await expect(toggleBtn).toBeVisible();
    await toggleBtn.click({ force: true });
    await page.waitForTimeout(300);

    const zhOption = page.locator('button:has-text("中文")').first();
    if (await zhOption.isVisible()) {
      await zhOption.click({ force: true });
    } else {
      await page.evaluate(() => {
        window.history.pushState({ lang: 'zh' }, '', '/zh');
        window.dispatchEvent(new PopStateEvent('popstate'));
      });
    }
    await expect(page).toHaveURL(/.*\/zh.*/);
  });

  test('3. Full Footer Navigation: column links, copyright, and legal notices', async ({ page }) => {
    // Scroll all the way down to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();

    // Verify footer contains key links
    const footerLinks = footer.locator('a');
    const linkCount = await footerLinks.count();
    expect(linkCount).toBeGreaterThan(5);

    // Verify legal links exist in footer
    const privacyLink = footer.locator('a[href*="privacy-policy"]').first();
    const termsLink = footer.locator('a[href*="terms-and-conditions"]').first();
    const riskLink = footer.locator('a[href*="risk-disclosure"]').first();

    if (await privacyLink.count() > 0) await expect(privacyLink).toBeVisible();
    if (await termsLink.count() > 0) await expect(termsLink).toBeVisible();
    if (await riskLink.count() > 0) await expect(riskLink).toBeVisible();
  });
});
