import { test } from '@playwright/test';
import dotenv from 'dotenv';
import { login, createEvent, logout, clearEvents } from '../utils/helpers.js';

dotenv.config();

test('Login, create event, and logout', async ({ page }) => {
  test.setTimeout(60000);
  const { BASE_URL, LOGIN_EMAIL, LOGIN_PASSWORD } = process.env;
  await login(page, BASE_URL, LOGIN_EMAIL, LOGIN_PASSWORD);
  await clearEvents(page);
  await createEvent(page);  
  await logout(page);
});
