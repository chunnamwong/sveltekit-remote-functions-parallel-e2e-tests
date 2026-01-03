import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: 'e2e',

	/* Run tests in files in parallel */
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	retries: process.env.CI ? 2 : 0,

	globalSetup: 'global-setup.ts',

	use: {
		browserName: 'chromium',
	},
});
