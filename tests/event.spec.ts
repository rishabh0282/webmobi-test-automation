import { test, expect } from '@playwright/test';
import { createEvent, clearEvents, logout } from './helpers/event-helpers';
import sampleEvents from './helpers/sampleEvents';

test.describe('Event Creation and Validation', () => {
  test.beforeEach(async ({ page }) => {
    const email = process.env.LOGIN_EMAIL2;
    const password = process.env.LOGIN_PASSWORD;

    if (!email || !password) {
      throw new Error('LOGIN_EMAIL2 and LOGIN_PASSWORD (or LOGIN_PASSWORD2) environment variables must be set');
    }

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
      // Try alternative selectors
      try {
        await expect(page.getByText(/Quick Actions/i)).toBeVisible({ timeout: 5000 });
        console.log('Quick Actions found (alternative selector) - login successful');
      } catch (e2) {
        // Fallback: check if we're not on login page anymore
        const currentUrl = page.url();
        if (!currentUrl.includes('/login') && !currentUrl.includes('/auth')) {
          console.log('Login appears successful - URL changed from login page');
        } else {
          throw new Error('Could not verify login - Quick Actions not found and still on login page');
        }
      }
    }

    await page.waitForTimeout(2000);
  });

  test('should create an event and validate it appears in the list', async ({ page }) => {
    console.log('Cleaning up latest event...');
    try {
      await clearEvents(page);
      console.log('Latest event deleted successfully');
    } catch (e) {
      console.log('Note: Could not delete latest event (may not exist), continuing anyway:', e);
    }

    // Select a random meaningful event prompt from sample events
    const eventPrompt = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];
    console.log(`Creating event with prompt: ${eventPrompt}`);

    // Create event using helper function (AI assistant will create the actual event)
    const actualTitle = await createEvent(page, eventPrompt);

    // Validate that the event was created
    // The createEvent function already navigates to My Events and gets the title
    // We can verify the title is related to what we sent
    expect(actualTitle).toBeTruthy();
    console.log(`Event validation successful - event created with title: ${actualTitle}`);
    
    // Additional validation: verify we're on My Events page and can see the event
    await expect(page.getByRole('heading', { name: 'My Events' })).toBeVisible({ timeout: 10000 });
    
    // Verify the event title appears in the list
    const eventTitleElement = page.locator('h3.text-xl').first();
    await expect(eventTitleElement).toBeVisible({ timeout: 10000 });
    const displayedTitle = await eventTitleElement.innerText();
    expect(displayedTitle).toBeTruthy();
    console.log(`Event displayed in list with title: ${displayedTitle}`);

    // Logout after all verifications are complete
    console.log('Logging out after successful event creation and validation...');
    await logout(page);
    console.log('Test completed successfully with logout');
  });
});

