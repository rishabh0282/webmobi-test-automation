import { expect } from '@playwright/test';
import sampleEvents from './sampleEvents.js';

function assertTitleRelated(expected, actual, context = '') {
  const keywords = expected
    .toLowerCase()
    .split(/\s+/)
    .filter(k => k.length > 3);

  const matchCount = keywords.filter(k => actual.toLowerCase().includes(k)).length;

  if (matchCount === 0) {
    throw new Error(`No keyword overlap (${context}). Prompt: "${expected}", got: "${actual}"`);
  } else {
    console.log(` [${context}] Title is related. ${matchCount} keyword(s) matched.`);
  }
}

export async function login(page, baseUrl, email, password) {
  await page.goto(baseUrl);
  await page.getByRole('button', { name: /login/i }).click();
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button:has-text("sign in")');
  await expect(page.locator('text=Quick Actions')).toBeVisible({ timeout: 10000 });
  await page.waitForTimeout(2000);
}

export async function logout(page) {
  await page.click('button:has(svg.lucide-log-out)');
  await expect(page.locator('button:has-text("sign in")')).toBeVisible({ timeout: 10000 });
  await page.waitForTimeout(1000);
}

export async function createEvent(page, eventTitle = null) {
  if (!eventTitle) {
    eventTitle = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];
  }
  const [response] = await Promise.all([
    page.waitForResponse(resp =>
      resp.url().includes('/api/events') && resp.request().method() === 'POST'
    ),
    (async () => {
      await page.click('button:has-text("New Event"), a:has-text("Create Event")');
      await page.fill('textarea[placeholder="Describe your event..."]', eventTitle);
      await page.keyboard.press('Enter');
    })()
  ]);

  //  API verification
  expect(response.status()).toBe(201);
  console.log(`New Event creation success API returned ${response.status()}`);
  await page.click('button:has-text("New Event"), a:has-text("Create Event")');
  await page.waitForSelector('textarea[placeholder="Describe your event..."]', { state: 'visible' });

  await page.fill('textarea[placeholder="Describe your event..."]', eventTitle);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(8000);
  // Assistant reply
  const replyLocator = page.locator('.glass-morphism .prose h1');
  
  if (await replyLocator.count() > 0) {
    const refinedTitle = await replyLocator.innerText();
    console.log(`Assistant reply captured: ${refinedTitle}`);
    assertTitleRelated(eventTitle, refinedTitle, 'Assistant reply');
  } else {
    console.warn('No assistant reply, relying on persisted event only');
  }

  await page.waitForTimeout(2000);

  // Navigate to My Events
  await page.getByRole('link', { name: 'My Events' }).click();
  await expect(page.getByText(/manage and monitor/i)).toBeVisible({ timeout: 10000 });
  

  // Persisted draft check
  const actualTitle = await page.locator('h3.text-xl').first().innerText();
  console.log(` Persisted draft captured: ${actualTitle}`);
  assertTitleRelated(eventTitle, actualTitle, 'Persisted draft');

  await page.waitForTimeout(3000);
  return actualTitle;
}

export async function clearEvents(page) {
 
  await page.getByRole('link', { name: 'My Events' }).click();
  await expect(page.getByRole('heading', { name: 'My Events' })).toBeVisible({ timeout: 10000 });

  // Locate the first 3-dots menu trigger
  const firstMenuTrigger = page.locator('button[data-slot="dropdown-menu-trigger"]').first();
  await expect(firstMenuTrigger).toBeVisible({ timeout: 5000 });

  // Handle the confirm dialog
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

  // Verify API response
  console.log(`Delete API status: ${response.status()}`);
  expect([200, 204]).toContain(response.status());

  await page.waitForTimeout(1000);
  console.log('Deleted the latest event with API check');
}





  



