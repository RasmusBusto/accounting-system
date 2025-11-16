import { test, expect } from '@playwright/test';

test.describe('Settings Polish and Ukrainian', () => {
  test('should show Polish and Ukrainian translations', async ({ page, context }) => {
    // Clear all cookies and cache
    await context.clearCookies();

    await page.goto('http://localhost:4200/settings');
    // Hard reload to bypass cache
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Test Polish
    console.log('📍 Testing Polish');
    await page.evaluate(() => {
      localStorage.setItem('i18nextLng', 'pl');
    });
    await page.reload();
    await page.waitForTimeout(3000);

    await page.screenshot({ path: '/tmp/settings-polish-test.png', fullPage: true });

    // Check for Polish text
    const departmentsTabPl = page.locator('button:has-text("Działy")');
    const projectsTabPl = page.locator('button:has-text("Projekty")');

    await expect(departmentsTabPl).toBeVisible({ timeout: 10000 });
    await expect(projectsTabPl).toBeVisible();
    console.log('✅ Polish verified');

    // Test Ukrainian
    console.log('📍 Testing Ukrainian');
    await page.evaluate(() => {
      localStorage.setItem('i18nextLng', 'uk');
    });
    await page.reload();
    await page.waitForTimeout(3000);

    await page.screenshot({ path: '/tmp/settings-ukrainian-test.png', fullPage: true });

    // Check for Ukrainian text
    const departmentsTabUk = page.locator('button:has-text("Відділи")');
    const projectsTabUk = page.locator('button:has-text("Проєкти")');

    await expect(departmentsTabUk).toBeVisible({ timeout: 10000 });
    await expect(projectsTabUk).toBeVisible();
    console.log('✅ Ukrainian verified');
  });
});
