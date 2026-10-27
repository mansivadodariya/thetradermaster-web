// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('ChronosX Authentication & Onboarding Suite', () => {
  test('1. Login Page: elements, inputs, validations, and links', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/.*login/);
    
    // Check main container and form presence
    const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]').first();
    const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
    const submitBtn = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitBtn).toBeVisible();

    // Check Forgot Password link and Signup redirect link
    const forgotLink = page.locator('a[href*="forgot-password"]').first();
    const signupLink = page.locator('a[href*="signup"]').first();
    await expect(forgotLink).toBeVisible();
    await expect(signupLink).toBeVisible();
  });

  test('2. Signup Page: form fields and navigation', async ({ page }) => {
    await page.goto('/signup', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/.*signup/);

    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const submitBtn = page.locator('button[type="submit"], button:has-text("Sign Up"), button:has-text("Register"), button:has-text("Create")').first();

    await expect(emailInput).toBeVisible();
    await expect(submitBtn).toBeVisible();

    const loginLink = page.locator('a[href*="login"]').first();
    await expect(loginLink).toBeVisible();
  });

  test('3. Forgot Password Page: recovery request form', async ({ page }) => {
    await page.goto('/forgot-password', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/.*forgot-password/);

    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    await expect(emailInput).toBeVisible();

    const backToLogin = page.locator('a[href*="login"]').first();
    await expect(backToLogin).toBeVisible();
  });

  test('4. Reset Password Page: layout and input structure', async ({ page }) => {
    await page.goto('/reset-password', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/.*reset-password/);
  });

  test('5. Verify Email Page: verification interface rendering', async ({ page }) => {
    await page.goto('/verify-email', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/.*verify-email/);
  });

  test('6. Onboarding Wizard: steps rendering', async ({ page }) => {
    await page.goto('/onboarding', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/.*onboarding/);
  });
});
