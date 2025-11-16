import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  use: {
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: './startme-dev.sh',
    port: 4200,
    timeout: 120000,
    reuseExistingServer: true,
  },
});
