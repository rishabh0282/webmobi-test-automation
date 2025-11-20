import { test } from '@playwright/test';
import dotenv from 'dotenv';
import { login, createEvent, logout } from '../utils/helpers.js';

dotenv.config();

test('Login, create event, and logout', async ({ page }) => {
  const { BASE_URL, LOGIN_EMAIL, LOGIN_PASSWORD } = process.env;
  await login(page, BASE_URL, LOGIN_EMAIL, LOGIN_PASSWORD);
  await createEvent(page);  
  await logout(page);
});
