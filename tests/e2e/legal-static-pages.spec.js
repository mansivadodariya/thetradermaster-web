// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('TraderMaster Institutional & Legal Compliance Suite', () => {
  const staticRoutes = [
    { path: '/about-us', title: /About/i },
    { path: '/affiliate-program', title: /Affiliate/i },
    { path: '/white-label', title: /White Label/i },
    { path: '/contact-us', title: /Contact/i },
    { path: '/terms-and-conditions', title: /Terms/i },
    { path: '/privacy-policy', title: /Privacy/i },
    { path: '/no-refund-policy', title: /Refund/i },
    { path: '/risk-disclosure', title: /Risk/i },
  ];

  for (const route of staticRoutes) {
    test(`Static page renders cleanly: ${route.path}`, async ({ page }) => {
      await page.goto(route.path);
      await expect(page).toHaveURL(new RegExp(route.path));
      
      const content = page.locator('main, article, [class*="container" i]').first();
      await expect(content).toBeVisible();
    });
  }
});
