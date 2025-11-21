import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { login, logout } from '../utils/helpers.js';

dotenv.config();

test('Accessing dashboard after logout redirects to login', async ({ page }) => {
  const { BASE_URL, LOGIN_EMAIL2, LOGIN_PASSWORD } = process.env;

  await login(page, BASE_URL, LOGIN_EMAIL2, LOGIN_PASSWORD);
  await logout(page);

  // Try to access dashboard directly
  await page.goto(`${BASE_URL}/dashboard`);
  await expect(page).toHaveURL(/auth\/login/);
  await page.waitForTimeout(2000);

});
