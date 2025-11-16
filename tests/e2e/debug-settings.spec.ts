import { test, expect } from '@playwright/test';

test('debug settings page', async ({ page }) => {
  const errors: string[] = [];
  const logs: string[] = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    } else {
      logs.push(`${msg.type()}: ${msg.text()}`);
    }
  });

  page.on('pageerror', error => {
    errors.push(`PAGE ERROR: ${error.message}`);
  });

  console.log('🔍 Navigating to settings page...');
  await page.goto('http://localhost:4200/settings');

  await page.waitForTimeout(5000);

  console.log('\n📸 Taking screenshot...');
  await page.screenshot({ path: '/tmp/debug-settings.png', fullPage: true });

  console.log('\n📄 Page HTML:');
  const html = await page.content();
  console.log(html.substring(0, 2000));

  console.log('\n❌ Errors found:', errors.length);
  errors.forEach(err => console.log('  -', err));

  console.log('\n📝 Console logs:', logs.length);
  logs.slice(-10).forEach(log => console.log('  -', log));

  console.log('\n✅ Debug complete');
});
