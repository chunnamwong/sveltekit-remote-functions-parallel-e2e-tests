import { expect } from '@playwright/test';
import { e2e } from './fixtures';

e2e('shows user count on home page', async ({ page, base: { appUrl } }) => {
	await page.goto(appUrl);
	// By default there is one user from the seed data
	await expect(page.getByRole('paragraph')).toContainText('User Count: 1');
});

e2e('handles username conflicts', async ({ page, base: { appUrl } }) => {
	await page.goto(`${appUrl}/users/register`);
	// Try to pick the same username in the seed data
	await page.getByRole('textbox', { name: 'Username' }).fill('user');
	await page.getByRole('textbox', { name: 'Password' }).fill('123456');
	await page.getByRole('button', { name: 'Register' }).click();
	await expect(page.getByText('Username has been taken.')).toBeVisible();
});

e2e('registers new users correctly', async ({ page, base: { appUrl } }) => {
	await page.goto(`${appUrl}/users/register`);
	await page.getByRole('textbox', { name: 'Username' }).fill('newuser');
	await page.getByRole('textbox', { name: 'Password' }).fill('123456');
	await page.getByRole('button', { name: 'Register' }).click();
	await page.waitForURL(appUrl);
	await expect(page.getByRole('paragraph')).toContainText('User Count: 2');
});
