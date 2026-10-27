# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: localization-full-cycle.spec.js >> ChronosX Full-Cycle 9-Language Localization Suite >> Locale FIL initialization & RTL/LTR validation
- Location: tests\e2e\localization-full-cycle.spec.js:18:5

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: page.goto: Test timeout of 60000ms exceeded.
Call log:
  - navigating to "http://localhost:3000/", waiting until "domcontentloaded"

```

# Test source

```ts
  1  | // @ts-check
  2  | const { test, expect } = require('@playwright/test');
  3  | 
  4  | test.describe('ChronosX Full-Cycle 9-Language Localization Suite', () => {
  5  |   const languages = [
  6  |     { code: 'en', dir: 'ltr' },
  7  |     { code: 'ar', dir: 'rtl' },
  8  |     { code: 'ary', dir: 'rtl' },
  9  |     { code: 'es', dir: 'ltr' },
  10 |     { code: 'ru', dir: 'ltr' },
  11 |     { code: 'zh', dir: 'ltr' },
  12 |     { code: 'vi', dir: 'ltr' },
  13 |     { code: 'id', dir: 'ltr' },
  14 |     { code: 'fil', dir: 'ltr' },
  15 |   ];
  16 | 
  17 |   for (const lang of languages) {
  18 |     test(`Locale ${lang.code.toUpperCase()} initialization & RTL/LTR validation`, async ({ page }) => {
  19 |       // Set localStorage language preference before loading
  20 |       await page.addInitScript((l) => {
  21 |         window.localStorage.setItem('language', l);
  22 |         window.localStorage.setItem('NEXT_LOCALE', l);
  23 |       }, lang.code);
  24 | 
> 25 |       await page.goto('/', { waitUntil: 'domcontentloaded' });
     |                  ^ Error: page.goto: Test timeout of 60000ms exceeded.
  26 | 
  27 |       // Verify HTML dir or lang attribute if set
  28 |       if (lang.dir === 'rtl') {
  29 |         const htmlDir = await page.locator('html').getAttribute('dir');
  30 |         const bodyDir = await page.locator('body').getAttribute('dir');
  31 |         expect(htmlDir === 'rtl' || bodyDir === 'rtl' || true).toBeTruthy();
  32 |       }
  33 |     });
  34 |   }
  35 | 
  36 |   test('Direct URL language links (e.g. /arabic, /spanish, /russian, /chinese)', async ({ page }) => {
  37 |     const directLinks = [
  38 |       { url: '/arabic', expectedLang: 'ar', isRTL: true },
  39 |       { url: '/spanish', expectedLang: 'es', isRTL: false },
  40 |       { url: '/russian', expectedLang: 'ru', isRTL: false },
  41 |       { url: '/chinese', expectedLang: 'zh', isRTL: false },
  42 |       { url: '/vietnamese', expectedLang: 'vi', isRTL: false },
  43 |       { url: '/indonesian', expectedLang: 'id', isRTL: false },
  44 |       { url: '/filipino', expectedLang: 'fil', isRTL: false },
  45 |       { url: '/darija', expectedLang: 'ary', isRTL: true },
  46 |     ];
  47 | 
  48 |     for (const item of directLinks) {
  49 |       await page.goto(item.url, { waitUntil: 'domcontentloaded' });
  50 |       await expect(page.locator('html')).toHaveAttribute('lang', item.expectedLang);
  51 |       if (item.isRTL) {
  52 |         await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  53 |       }
  54 |     }
  55 |   });
  56 | 
  57 |   test('Subpage Localized Route Resolution (e.g. /contact-us, /en/contact-us, /ar/contact-us)', async ({ page }) => {
  58 |     // 1. Direct /contact-us
  59 |     await page.goto('/contact-us', { waitUntil: 'domcontentloaded' });
  60 |     await expect(page).toHaveURL(/.*contact-us/);
  61 | 
  62 |     // 2. Localized /en/contact-us
  63 |     await page.goto('/en/contact-us', { waitUntil: 'domcontentloaded' });
  64 |     await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  65 |     await expect(page).toHaveURL(/.*\/en\/contact-us/);
  66 | 
  67 |     // 3. Localized /ar/contact-us
  68 |     await page.goto('/ar/contact-us', { waitUntil: 'domcontentloaded' });
  69 |     await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  70 |     await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  71 | 
  72 |     // 4. Localized /zh/contact-us
  73 |     await page.goto('/zh/contact-us', { waitUntil: 'domcontentloaded' });
  74 |     await expect(page.locator('html')).toHaveAttribute('lang', 'zh');
  75 |   });
  76 | });
  77 | 
  78 | 
```