import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/firefox';

describe('i18n Internationalization Tests', () => {
  let driver: WebDriver;
  const baseUrl = 'http://localhost:4200';

  beforeAll(async () => {
    const options = new Options();
    options.addArguments('--headless'); // Run in headless mode

    driver = await new Builder()
      .forBrowser('firefox')
      .setFirefoxOptions(options)
      .build();
  }, 30000);

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  test('should display Norwegian navigation menu by default', async () => {
    await driver.get(baseUrl);

    // Wait for page to load
    await driver.wait(until.elementLocated(By.css('nav')), 10000);

    // Check Norwegian menu items
    const dashboardLink = await driver.findElement(By.linkText('Dashbord'));
    expect(await dashboardLink.getText()).toBe('Dashbord');

    const invoicesLink = await driver.findElement(By.linkText('Fakturaer'));
    expect(await invoicesLink.getText()).toBe('Fakturaer');

    const expensesLink = await driver.findElement(By.linkText('Utgifter'));
    expect(await expensesLink.getText()).toBe('Utgifter');

    const reportsLink = await driver.findElement(By.linkText('Rapporter'));
    expect(await reportsLink.getText()).toBe('Rapporter');

    const clientsLink = await driver.findElement(By.linkText('Kunder'));
    expect(await clientsLink.getText()).toBe('Kunder');
  }, 30000);

  test('should switch to English when language is changed', async () => {
    await driver.get(baseUrl);

    // Wait for page to load
    await driver.wait(until.elementLocated(By.css('nav')), 10000);

    // Find and click language dropdown
    const languageSelect = await driver.findElement(By.css('select'));
    await languageSelect.click();

    // Select English
    const englishOption = await driver.findElement(By.css('option[value="en"]'));
    await englishOption.click();

    // Wait a bit for language change to take effect
    await driver.sleep(1000);

    // Check English menu items
    const dashboardLink = await driver.findElement(By.linkText('Dashboard'));
    expect(await dashboardLink.getText()).toBe('Dashboard');

    const invoicesLink = await driver.findElement(By.linkText('Invoices'));
    expect(await invoicesLink.getText()).toBe('Invoices');

    const expensesLink = await driver.findElement(By.linkText('Expenses'));
    expect(await expensesLink.getText()).toBe('Expenses');

    const reportsLink = await driver.findElement(By.linkText('Reports'));
    expect(await reportsLink.getText()).toBe('Reports');

    const clientsLink = await driver.findElement(By.linkText('Clients'));
    expect(await clientsLink.getText()).toBe('Clients');
  }, 30000);

  test('should display dashboard content in Norwegian', async () => {
    await driver.get(baseUrl);

    // Wait for dashboard to load
    await driver.wait(until.elementLocated(By.css('h1')), 10000);

    // Check dashboard title
    const title = await driver.findElement(By.css('h1'));
    expect(await title.getText()).toBe('Dashbord');
  }, 30000);
});
