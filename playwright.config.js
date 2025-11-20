// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,   // ✅ run all tests in parallel
  retries: 1,            // optional: retry once on failure
  reporter: [['list'], ['html', { outputFolder: 'playwright-report' }]], // nice HTML report
  use: {
    headless: true,
    trace: 'on',
    video: 'on',
  },
});
