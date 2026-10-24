import { defineConfig } from 'playwright/test';
export default defineConfig({
  testDir: './tests',
  workers: 1,
  retries: 0,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  outputDir: './test-results',
  reporter: [['list'], ['json', { outputFile: './artifacts/results.json' }]],
  use: { baseURL: process.env.BASE_URL || 'http://localhost:3100', screenshot: 'on', trace: 'on' },
  webServer: process.env.QA_START_STORE === '1' ? {
    command: `npm run start -- --port ${new URL(process.env.BASE_URL || 'http://localhost:3100').port}`,
    url: process.env.BASE_URL || 'http://localhost:3100',
    reuseExistingServer: false,
    timeout: 30_000
  } : undefined,
  projects: [
    { name: 'desktop', use: { viewport: { width: 1280, height: 900 } } },
    { name: 'mobile', use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } }
  ]
});
