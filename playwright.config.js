import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: 0,
  use: {
    baseURL: 'http://localhost:5198',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npx vite --port 5198',
    port: 5198,
    reuseExistingServer: true,
  },
});
