import { test, expect } from '@playwright/test';

test.describe('Settings Language Switching', () => {
  test('should switch all Settings text when language is changed', async ({ page }) => {
    // Navigate to settings page
    await page.goto('http://localhost:4200/settings');
    await page.waitForTimeout(2000);

    console.log('📍 Initial page load - checking default language');

    // Take screenshot of initial state (should be Norwegian by default)
    await page.screenshot({ path: '/tmp/settings-lang-initial.png', fullPage: true });

    // Verify Norwegian is showing (default)
    const departmentsTabNo = page.locator('button:has-text("Avdelinger")');
    const projectsTabNo = page.locator('button:has-text("Prosjekter")');
    const addDeptButtonNo = page.locator('button:has-text("Legg til avdeling")');

    await expect(departmentsTabNo).toBeVisible({ timeout: 10000 });
    console.log('✅ Norwegian text found: "Avdelinger"');

    // Click language switcher to English
    console.log('🔄 Switching to English...');
    const langSwitcher = page.locator('select, button').filter({ hasText: /Norsk|Norwegian|Språk|Language/i }).first();

    // Try to find and click language dropdown
    const langDropdown = page.locator('[data-testid="language-selector"], select[name="language"], button:has-text("Norsk")').first();

    if (await langDropdown.isVisible({ timeout: 5000 }).catch(() => false)) {
      await langDropdown.click();
      await page.waitForTimeout(500);

      // Click English option
      const englishOption = page.locator('text=English, text=Engelsk').first();
      if (await englishOption.isVisible({ timeout: 2000 }).catch(() => false)) {
        await englishOption.click();
      } else {
        // Try selecting from dropdown
        await page.selectOption('select', 'en').catch(() => {
          console.log('Could not select English from dropdown');
        });
      }
    } else {
      console.log('⚠️  Language switcher not found, trying localStorage approach');
      // Directly set language in localStorage
      await page.evaluate(() => {
        localStorage.setItem('i18nextLng', 'en');
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'i18nextLng',
          newValue: 'en',
          oldValue: 'no'
        }));
      });
    }

    await page.waitForTimeout(2000);
    await page.screenshot({ path: '/tmp/settings-lang-english.png', fullPage: true });

    // Verify English text appears
    console.log('🔍 Checking for English text...');
    const departmentsTabEn = page.locator('button:has-text("Departments")');
    const projectsTabEn = page.locator('button:has-text("Projects")');
    const addDeptButtonEn = page.locator('button:has-text("Add Department")');

    await expect(departmentsTabEn).toBeVisible({ timeout: 10000 });
    console.log('✅ English text found: "Departments"');

    await expect(projectsTabEn).toBeVisible();
    console.log('✅ English text found: "Projects"');

    await expect(addDeptButtonEn).toBeVisible();
    console.log('✅ English text found: "Add Department"');

    // Check table headers are in English
    const codeHeader = page.locator('th:has-text("Code")').first();
    const nameHeader = page.locator('th:has-text("Name")').first();
    const descriptionHeader = page.locator('th:has-text("Description")').first();

    await expect(codeHeader).toBeVisible();
    console.log('✅ Table header in English: "Code"');

    await expect(nameHeader).toBeVisible();
    console.log('✅ Table header in English: "Name"');

    // Switch to Projects tab to check those translations too
    await projectsTabEn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/tmp/settings-lang-english-projects.png', fullPage: true });

    const addProjectButtonEn = page.locator('button:has-text("Add Project")');
    await expect(addProjectButtonEn).toBeVisible();
    console.log('✅ English text found on Projects tab: "Add Project"');

    // Check project-specific headers
    const statusHeader = page.locator('th:has-text("Status")').first();
    const datesHeader = page.locator('th:has-text("Dates")').first();

    await expect(statusHeader).toBeVisible();
    console.log('✅ Projects table header in English: "Status"');

    // Switch back to Norwegian
    console.log('🔄 Switching back to Norwegian...');
    await page.evaluate(() => {
      localStorage.setItem('i18nextLng', 'no');
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'i18nextLng',
        newValue: 'no',
        oldValue: 'en'
      }));
    });

    await page.waitForTimeout(2000);
    await page.screenshot({ path: '/tmp/settings-lang-norwegian-final.png', fullPage: true });

    // Verify back to Norwegian
    const projectsTabNoFinal = page.locator('button:has-text("Prosjekter")');
    const addProjectButtonNo = page.locator('button:has-text("Legg til prosjekt")');

    await expect(projectsTabNoFinal).toBeVisible({ timeout: 10000 });
    console.log('✅ Norwegian text restored: "Prosjekter"');

    await expect(addProjectButtonNo).toBeVisible();
    console.log('✅ Norwegian text restored: "Legg til prosjekt"');

    console.log('\n📸 Screenshots saved:');
    console.log('  - /tmp/settings-lang-initial.png');
    console.log('  - /tmp/settings-lang-english.png');
    console.log('  - /tmp/settings-lang-english-projects.png');
    console.log('  - /tmp/settings-lang-norwegian-final.png');
    console.log('\n✅ All language switching tests passed!');
  });

  test('should translate form labels when creating a department', async ({ page }) => {
    await page.goto('http://localhost:4200/settings');
    await page.waitForTimeout(2000);

    // Set to English
    await page.evaluate(() => {
      localStorage.setItem('i18nextLng', 'en');
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'i18nextLng',
        newValue: 'en',
        oldValue: 'no'
      }));
    });
    await page.waitForTimeout(1000);

    // Click Add Department
    const addButton = page.locator('button:has-text("Add Department")');
    await addButton.click();
    await page.waitForTimeout(1000);

    await page.screenshot({ path: '/tmp/settings-form-english.png', fullPage: true });

    // Check form is in English
    const formTitle = page.locator('h3:has-text("Create Department")');
    await expect(formTitle).toBeVisible();
    console.log('✅ Form title in English: "Create Department"');

    const codeLabel = page.locator('label:has-text("Code")');
    const nameLabel = page.locator('label:has-text("Name")');
    const descriptionLabel = page.locator('label:has-text("Description")');
    const saveButton = page.locator('button[type="submit"]:has-text("Save")');
    const cancelButton = page.locator('button:has-text("Cancel")');

    await expect(codeLabel).toBeVisible();
    await expect(nameLabel).toBeVisible();
    await expect(descriptionLabel).toBeVisible();
    await expect(saveButton).toBeVisible();
    await expect(cancelButton).toBeVisible();

    console.log('✅ All form labels in English');
    console.log('📸 Form screenshot saved: /tmp/settings-form-english.png');
  });
});
