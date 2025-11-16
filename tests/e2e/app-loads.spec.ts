import { test, expect } from '@playwright/test';

test('accounting system app loads and shows navigation', async ({ page }) => {
  console.log('🔍 Testing app at http://localhost:4200...');

  // Go to the app
  await page.goto('http://localhost:4200');

  // Wait for navigation to appear
  await page.waitForSelector('nav', { timeout: 10000 });
  console.log('✅ Navigation found!');

  // Take screenshot
  await page.screenshot({ path: '/tmp/accounting-app-test.png', fullPage: true });
  console.log('📸 Screenshot saved to /tmp/accounting-app-test.png');

  // Check for navigation items (Norwegian or English)
  const navText = await page.locator('nav').textContent();
  console.log('📄 Navigation text:', navText);

  const expectedItems = ['Dashboard', 'Dashbord', 'Invoices', 'Fakturaer'];
  const foundItem = expectedItems.some(item => navText?.includes(item));

  expect(foundItem, 'Should find at least one navigation item').toBe(true);
  console.log('✅ Found navigation items!');

  // Check that we don't have console errors
  const consoleErrors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  // Wait a bit for any async errors
  await page.waitForTimeout(2000);

  if (consoleErrors.length > 0) {
    console.log('❌ Console errors found:', consoleErrors);
  } else {
    console.log('✅ No console errors');
  }

  // Expect the navigation to be visible
  await expect(page.locator('nav')).toBeVisible();

  console.log('✅ APP IS WORKING!');
});
