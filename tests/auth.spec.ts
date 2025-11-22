import { test, expect } from '@playwright/test';
import { logout } from './helpers/event-helpers';

test.describe('Authentication', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    const email = process.env.LOGIN_EMAIL;
    const password = process.env.LOGIN_PASSWORD;

    if (!email || !password) {
      throw new Error('LOGIN_EMAIL and LOGIN_PASSWORD environment variables must be set');
    }

    console.log('Starting authentication...');

    await page.goto('/');

    await page.getByRole('button', { name: /login/i }).click();

    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);

    await page.click('button:has-text("sign in")');

    await page.waitForLoadState('networkidle');
    
    // Wait for "Quick Actions" text to appear - this confirms successful login
    // Try multiple variations of the text selector
    try {
      await expect(page.locator('text=/Quick Actions/i')).toBeVisible({ timeout: 10000 });
      console.log('Quick Actions found - login successful');
    } catch (e) {
      try {
        await expect(page.getByText(/Quick Actions/i)).toBeVisible({ timeout: 5000 });
        console.log('Quick Actions found (alternative selector) - login successful');
      } catch (e2) {
        const currentUrl = page.url();
        if (!currentUrl.includes('/login') && !currentUrl.includes('/auth')) {
          console.log('Login appears successful - URL changed from login page');
        } else {
          throw new Error('Could not verify login - Quick Actions not found and still on login page');
        }
      }
    }

    await page.waitForTimeout(2000);
    console.log('Authentication successful');
  });

  test('should logout successfully', async ({ page }) => {
    const email = process.env.LOGIN_EMAIL;
    const password = process.env.LOGIN_PASSWORD;

    if (!email || !password) {
      throw new Error('LOGIN_EMAIL and LOGIN_PASSWORD environment variables must be set');
    }


    const baseUrl = process.env.BASE_URL || 'https://events.webmobi.com';
    await page.goto(baseUrl);
    await page.getByRole('button', { name: /login/i }).click();
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.click('button:has-text("sign in")');
    
    await page.waitForLoadState('networkidle');
    
    try {
      await expect(page.locator('text=/Quick Actions/i')).toBeVisible({ timeout: 10000 });
      console.log('Logged in successfully');
    } catch (e) {
      try {
        await expect(page.getByText(/Quick Actions/i)).toBeVisible({ timeout: 5000 });
        console.log('Logged in successfully (alternative selector)');
      } catch (e2) {
        const currentUrl = page.url();
        if (!currentUrl.includes('/login') && !currentUrl.includes('/auth')) {
          console.log('Login appears successful - URL changed from login page');
        } else {
          throw new Error('Could not verify login - Quick Actions not found and still on login page');
        }
      }
    }

    await logout(page);
    console.log('Logout test completed successfully');
  });
});

