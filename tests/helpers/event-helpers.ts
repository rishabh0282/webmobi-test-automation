import { Page, expect } from '@playwright/test';
import sampleEvents from './sampleEvents';

export async function navigateToMyEvents(page: Page): Promise<void> {
  console.log('Navigating to My Events...');
  
  await page.getByRole('link', { name: 'My Events' }).click();
  await expect(page.getByText(/manage and monitor/i)).toBeVisible({ timeout: 10000 });
  await page.waitForTimeout(1000);
}

// 
//    Create an event with the given prompt (or a random one from sampleEvents if not provided)
//  
export async function createEvent(page: Page, eventPrompt: string | null = null): Promise<string> {
  //   Use provided prompt or select a random one from sample events
  if (!eventPrompt) {
    eventPrompt = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];
  }
  
  console.log(`Creating event with prompt: ${eventPrompt}`);

  const [response] = await Promise.all([
    page.waitForResponse(resp =>
      resp.url().includes('/api/events') && resp.request().method() === 'POST'
    ),
    (async () => {
      await page.click('button:has-text("New Event"), a:has-text("Create Event")');
      await page.fill('textarea[placeholder="Describe your event..."]', eventPrompt);
      await page.keyboard.press('Enter');
    })()
  ]);

  //   API verification
  expect(response.status()).toBe(201);
  console.log(`New Event creation success API returned ${response.status()}`);
//     The AI assistant will create the actual event based on the prompt

  //   Click create button again and fill the textarea
  await page.click('button:has-text("New Event"), a:has-text("Create Event")');
  await page.waitForSelector('textarea[placeholder="Describe your event..."]', { state: 'visible' });
  await page.fill('textarea[placeholder="Describe your event..."]', eventPrompt);
  await page.keyboard.press('Enter');

  await page.waitForTimeout(8000);
  //   Returns the actual title from the persisted draft

  //   Check for assistant reply
  const replyLocator = page.locator('.glass-morphism .prose h1');
  if (await replyLocator.count() > 0) {
    const refinedTitle = await replyLocator.innerText();
    console.log(`Assistant reply captured: ${refinedTitle}`);
  } else {
    console.warn('No assistant reply, relying on persisted event only');
  }

  await page.waitForTimeout(2000);

  await navigateToMyEvents(page);

  const actualTitle = await page.locator('h3.text-xl').first().innerText();
  console.log(`Persisted draft captured: ${actualTitle}`);

  await page.waitForTimeout(3000);
  return actualTitle;
}


  // Clear/delete the first (latest) event from My Events page
  // Deletes events using the 3-dots menu pattern
 
export async function clearEvents(page: Page): Promise<void> {
  await page.getByRole('link', { name: 'My Events' }).click();
  await expect(page.getByRole('heading', { name: 'My Events' })).toBeVisible({ timeout: 10000 });

  // Locate the first 3-dots menu trigger
  const firstMenuTrigger = page.locator('button[data-slot="dropdown-menu-trigger"]').first();
  await expect(firstMenuTrigger).toBeVisible({ timeout: 5000 });

  page.once('dialog', async dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    await dialog.accept(); // click "OK"
  });

  const [response] = await Promise.all([
    page.waitForResponse(resp =>
      resp.url().includes('/api/events/') &&
      resp.request().method() === 'DELETE'
    ),
    (async () => {
      await firstMenuTrigger.click();
      const deleteOption = page.getByRole('menuitem', { name: 'Delete Event' });
      await expect(deleteOption).toBeVisible({ timeout: 5000 });
      await deleteOption.click();
    })()
  ]);

  console.log(`Delete API status: ${response.status()}`);
  expect([200, 204]).toContain(response.status());

  await page.waitForTimeout(1000);
  console.log('Deleted the latest event with API check');
}


//  Logout from the application

export async function logout(page: Page): Promise<void> {
  await page.click('button:has(svg.lucide-log-out)');
  await expect(page.locator('button:has-text("sign in")')).toBeVisible({ timeout: 10000 });
  await page.waitForTimeout(1000);
  console.log('Logout successful');
}


