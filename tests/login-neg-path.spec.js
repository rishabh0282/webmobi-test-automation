import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

test('Login fails with wrong password', async ({ page }) => {
  const { BASE_URL, LOGIN_EMAIL } = process.env;

  await page.goto(`${BASE_URL}/auth/login`);
  await page.fill('input[type="email"]', LOGIN_EMAIL);
  await page.fill('input[type="password"]', 'WrongPass123');
  await page.click('button[type="submit"]');

  await expect(page.locator('text=Invalid login credentials')).toBeVisible({ timeout: 3000 });
});
