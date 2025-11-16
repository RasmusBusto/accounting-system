import { test, expect } from '@playwright/test';

test.describe('Settings All Languages Switching', () => {
  test('should switch between Norwegian, English, Polish, and Ukrainian', async ({ page }) => {
    // Navigate to settings page
    await page.goto('http://localhost:4200/settings');
    await page.waitForTimeout(3000);

    console.log('📍 Test 1: Norwegian (default)');

    // Set to Norwegian
    await page.evaluate(() => {
      localStorage.setItem('i18nextLng', 'no');
    });
    await page.reload();
    await page.waitForTimeout(2000);

    await page.screenshot({ path: '/tmp/settings-all-lang-norwegian.png', fullPage: true });

    // Verify Norwegian text
    const departmentsTabNo = page.locator('button:has-text("Avdelinger")');
    const projectsTabNo = page.locator('button:has-text("Prosjekter")');
    const addDeptButtonNo = page.locator('button:has-text("Legg til avdeling")');

    await expect(departmentsTabNo).toBeVisible({ timeout: 10000 });
    await expect(projectsTabNo).toBeVisible();
    await expect(addDeptButtonNo).toBeVisible();

    console.log('✅ Norwegian verified: Avdelinger, Prosjekter, Legg til avdeling');

    // Check table headers in Norwegian
    const codeHeaderNo = page.locator('th:has-text("KODE")').first();
    const nameHeaderNo = page.locator('th:has-text("NAVN")').first();
    const descHeaderNo = page.locator('th:has-text("BESKRIVELSE")').first();

    await expect(codeHeaderNo).toBeVisible();
    await expect(nameHeaderNo).toBeVisible();
    await expect(descHeaderNo).toBeVisible();
    console.log('✅ Norwegian table headers: KODE, NAVN, BESKRIVELSE');

    // Test 2: English
    console.log('\n📍 Test 2: English');
    await page.evaluate(() => {
      localStorage.setItem('i18nextLng', 'en');
    });
    await page.reload();
    await page.waitForTimeout(2000);

    await page.screenshot({ path: '/tmp/settings-all-lang-english.png', fullPage: true });

    const departmentsTabEn = page.locator('button:has-text("Departments")');
    const projectsTabEn = page.locator('button:has-text("Projects")');
    const addDeptButtonEn = page.locator('button:has-text("Add Department")');

    await expect(departmentsTabEn).toBeVisible({ timeout: 10000 });
    await expect(projectsTabEn).toBeVisible();
    await expect(addDeptButtonEn).toBeVisible();

    console.log('✅ English verified: Departments, Projects, Add Department');

    // Check table headers in English
    const codeHeaderEn = page.locator('th:has-text("CODE")').first();
    const nameHeaderEn = page.locator('th:has-text("NAME")').first();
    const descHeaderEn = page.locator('th:has-text("DESCRIPTION")').first();

    await expect(codeHeaderEn).toBeVisible();
    await expect(nameHeaderEn).toBeVisible();
    await expect(descHeaderEn).toBeVisible();
    console.log('✅ English table headers: CODE, NAME, DESCRIPTION');

    // Test 3: Polish
    console.log('\n📍 Test 3: Polish');
    await page.evaluate(() => {
      localStorage.setItem('i18nextLng', 'pl');
    });
    await page.reload();
    await page.waitForTimeout(2000);

    await page.screenshot({ path: '/tmp/settings-all-lang-polish.png', fullPage: true });

    const departmentsTabPl = page.locator('button:has-text("Działy")');
    const projectsTabPl = page.locator('button:has-text("Projekty")');
    const addDeptButtonPl = page.locator('button:has-text("Dodaj dział")');

    await expect(departmentsTabPl).toBeVisible({ timeout: 10000 });
    await expect(projectsTabPl).toBeVisible();
    await expect(addDeptButtonPl).toBeVisible();

    console.log('✅ Polish verified: Działy, Projekty, Dodaj dział');

    // Check table headers in Polish
    const codeHeaderPl = page.locator('th:has-text("KOD")').first();
    const nameHeaderPl = page.locator('th:has-text("NAZWA")').first();
    const descHeaderPl = page.locator('th:has-text("OPIS")').first();

    await expect(codeHeaderPl).toBeVisible();
    await expect(nameHeaderPl).toBeVisible();
    await expect(descHeaderPl).toBeVisible();
    console.log('✅ Polish table headers: KOD, NAZWA, OPIS');

    // Test 4: Ukrainian
    console.log('\n📍 Test 4: Ukrainian');
    await page.evaluate(() => {
      localStorage.setItem('i18nextLng', 'uk');
    });
    await page.reload();
    await page.waitForTimeout(2000);

    await page.screenshot({ path: '/tmp/settings-all-lang-ukrainian.png', fullPage: true });

    const departmentsTabUk = page.locator('button:has-text("Відділи")');
    const projectsTabUk = page.locator('button:has-text("Проєкти")');
    const addDeptButtonUk = page.locator('button:has-text("Додати відділ")');

    await expect(departmentsTabUk).toBeVisible({ timeout: 10000 });
    await expect(projectsTabUk).toBeVisible();
    await expect(addDeptButtonUk).toBeVisible();

    console.log('✅ Ukrainian verified: Відділи, Проєкти, Додати відділ');

    // Check table headers in Ukrainian
    const codeHeaderUk = page.locator('th:has-text("КОД")').first();
    const nameHeaderUk = page.locator('th:has-text("НАЗВА")').first();
    const descHeaderUk = page.locator('th:has-text("ОПИС")').first();

    await expect(codeHeaderUk).toBeVisible();
    await expect(nameHeaderUk).toBeVisible();
    await expect(descHeaderUk).toBeVisible();
    console.log('✅ Ukrainian table headers: КОД, НАЗВА, ОПИС');

    // Test Projects tab in Ukrainian
    await projectsTabUk.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/tmp/settings-all-lang-ukrainian-projects.png', fullPage: true });

    const addProjectButtonUk = page.locator('button:has-text("Додати проєкт")');
    await expect(addProjectButtonUk).toBeVisible();
    console.log('✅ Ukrainian Projects tab: Додати проєкт');

    console.log('\n📸 Screenshots saved:');
    console.log('  - /tmp/settings-all-lang-norwegian.png');
    console.log('  - /tmp/settings-all-lang-english.png');
    console.log('  - /tmp/settings-all-lang-polish.png');
    console.log('  - /tmp/settings-all-lang-ukrainian.png');
    console.log('  - /tmp/settings-all-lang-ukrainian-projects.png');
    console.log('\n✅ All 4 languages tested successfully!');
  });
});
