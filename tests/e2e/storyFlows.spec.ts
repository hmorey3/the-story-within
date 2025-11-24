import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

test.describe('Story flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('tsw-stories', JSON.stringify([]));
    });
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Your library' })).toBeVisible();
    await expect(page.getByText('No stories yet. Start with your first spark.')).toBeVisible();
  });

  test.describe('Story cover workflows', () => {
    test('creates and saves a new story cover', async ({ page }) => {
      const storyName = await createStory(page, {
        notes: 'Testing the cover creation workflow.',
        coverName: 'Rising Above',
      });

      await expect(page.getByRole('button', { name: new RegExp(storyName, 'i') })).toBeVisible();
    });

    test('cancels a draft story without persisting it', async ({ page }) => {
      const initialCards = await page.locator('.story-card').count();

      await page.getByRole('button', { name: '+ New story' }).click();
      await page.getByLabel('Your story notes').fill('Should not persist');

      page.once('dialog', (dialog) => dialog.accept());
      await page.getByRole('button', { name: '← Back to story' }).click();

      await expect(page.locator('.story-card')).toHaveCount(initialCards);
      await expect(page.getByText('Should not persist')).toHaveCount(0);
    });

    test('edits an existing cover and persists changes', async ({ page }) => {
      const storyName = await createStory(page, { notes: 'Initial notes', coverName: 'Road to Peak' });
      await openStory(page, storyName);
      await page.getByRole('button', { name: /Edit cover/i }).click();

      await page.getByLabel('Your story notes').fill('Updated intentions for the journey.');
      await page.getByRole('button', { name: /Quiet Balance/ }).click();
      await page.getByRole('button', { name: 'Save' }).click();

      await waitForStoryView(page);
      await returnToLibrary(page);
      await expect(page.getByRole('button', { name: /Quiet Balance/i })).toBeVisible();

      await openStory(page, 'Quiet Balance');
      await expect(page.getByRole('heading', { name: 'Quiet Balance' })).toBeVisible();
      await expect(page.getByText('Updated intentions for the journey.')).toBeVisible();

      await page.reload();
      await expect(page.getByRole('heading', { name: 'Quiet Balance' })).toBeVisible();
      await expect(page.getByText('Updated intentions for the journey.')).toBeVisible();
    });

    test('deletes a story from the cover editor', async ({ page }) => {
      const storyName = await createStory(page, { notes: 'Delete me', coverName: 'Early Light' });
      await openStory(page, storyName);
      await page.getByRole('button', { name: /Edit cover/i }).click();

      page.once('dialog', (dialog) => dialog.accept());
      await page.getByRole('button', { name: 'Delete' }).click();

      await expect(page.getByRole('heading', { name: 'Your library' })).toBeVisible();
      await expect(page.locator('.story-card')).toHaveCount(0);
      await expect(page.getByText('No stories yet. Start with your first spark.')).toBeVisible();
    });
  });

  test.describe('Beat workflows', () => {
    test('adds a beat from the library and saves it', async ({ page }) => {
      const storyName = await createStory(page, { notes: 'Ready for beats', coverName: 'Safe Harbor' });
      await openStory(page, storyName);
      await expect(page.getByRole('heading', { name: storyName })).toBeVisible();

      await page.getByRole('button', { name: /New Story Beat/i }).click();

      await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();
      await page.getByRole('button', { name: /Glimpse of Dawn/ }).click();
      await page.getByLabel('Your notes').fill('Fresh beat from the hero’s journey.');

      await page.getByRole('button', { name: 'Save' }).click();
      await expect(page.getByRole('button', { name: 'Save' })).toHaveCount(0);

      await navigateBackToStory(page);

      const beats = page.locator('.story-view__beat');
      await expect(beats).toHaveCount(1);
      await expect(page.getByText('Glimpse of Dawn')).toBeVisible();
    });

    test('edits an existing beat and persists changes', async ({ page }) => {
      const storyName = await createStory(page, { notes: 'Needs beats', coverName: 'Return Home' });
      await openStory(page, storyName);
      await addBeatToStory(page, {
        templateName: 'Call to Adventure',
        notes: 'Starting point.',
      });

      const firstBeat = page.locator('.story-view__beat').first();
      await firstBeat.click();

      await page.getByRole('button', { name: 'Edit' }).click();
      await page.getByLabel('Your notes').fill('Refocusing the journey on gratitude.');
      await page.getByRole('button', { name: /New Ground/ }).click();

      await page.getByRole('button', { name: 'Save' }).click();
      await expect(page.getByRole('button', { name: 'Save' })).toHaveCount(0);

      await navigateBackToStory(page);

      const updatedBeat = page.locator('.story-view__beat').first();
      await expect(updatedBeat.getByRole('heading', { name: 'New Ground' })).toBeVisible();
      await expect(updatedBeat.getByText('Refocusing the journey on gratitude.')).toBeVisible();

      await updatedBeat.click();
      await expect(page.getByLabel('Your notes')).toHaveText('Refocusing the journey on gratitude.');
    });

    test('guards against losing unsaved beat edits', async ({ page }) => {
      const storyName = await createStory(page, { coverName: 'Wide Open' });
      await openStory(page, storyName);
      await addBeatToStory(page, {
        templateName: 'Call to Adventure',
        notes: 'Committed notes',
      });

      await page.locator('.story-view__beat').first().click();
      await page.getByRole('button', { name: 'Edit' }).click();
      await page.getByLabel('Your notes').fill('Unsaved text');

      page.once('dialog', (dialog) => dialog.dismiss());
      await page.getByRole('button', { name: '← Back to story' }).click();
      await expect(page.getByLabel('Your notes')).toHaveValue('Unsaved text');

      page.once('dialog', (dialog) => dialog.accept());
      await navigateBackToStory(page);
      await expect(page.locator('.story-view__beat').first().getByText('Unsaved text')).toHaveCount(0);
    });

    test('deletes a beat and returns to the story view', async ({ page }) => {
      const storyName = await createStory(page, { coverName: 'Center Stage' });
      await openStory(page, storyName);
      await addBeatToStory(page, {
        templateName: 'Call to Adventure',
        notes: 'First beat',
      });
      await addBeatToStory(page, {
        templateName: 'Crossing the Threshold',
        notes: 'Second beat',
      });

      await page.locator('.story-view__beat').nth(1).click();
      await page.getByRole('button', { name: 'Edit' }).click();

      page.once('dialog', (dialog) => dialog.accept());
      await page.getByRole('button', { name: 'Delete' }).click();

      await navigateBackToStory(page);
      await expect(page.locator('.story-view__beat')).toHaveCount(1);
      await expect(page.getByText('Second beat')).toHaveCount(0);
    });
  });
});

async function createStory(
  page: Page,
  { notes = '', coverName = 'Road to Peak' }: { notes?: string; coverName?: string }
) {
  await page.getByRole('button', { name: '+ New story' }).click();

  if (notes) {
    await page.getByLabel('Your story notes').fill(notes);
  }

  await page.getByRole('button', { name: new RegExp(coverName, 'i') }).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByRole('button', { name: 'Save' })).toHaveCount(0);
  await waitForStoryView(page);
  await returnToLibrary(page);
  return coverName;
}

async function openStory(page: Page, title: string) {
  const storyButton = page.getByRole('button', { name: new RegExp(title, 'i') });
  await expect(storyButton).toBeVisible();
  await Promise.all([page.waitForURL(storyPathRegex), storyButton.click()]);
}

async function addBeatToStory(
  page: Page,
  { templateName, notes }: { templateName: string; notes: string }
) {
  await page.getByRole('button', { name: /New Story Beat/i }).click();
  await page.getByRole('button', { name: new RegExp(templateName, 'i') }).click();
  await page.getByLabel('Your notes').fill(notes);
  await page.getByRole('button', { name: 'Save' }).click();
  await navigateBackToStory(page);
}

const storyPathRegex = /\/stories\/[^/]+$/;

async function waitForStoryView(page: Page) {
  await page.waitForURL(storyPathRegex);
}

async function navigateBackToStory(page: Page) {
  await Promise.all([
    page.waitForURL(storyPathRegex),
    page.getByRole('button', { name: '← Back to story' }).click(),
  ]);
}

async function returnToLibrary(page: Page) {
  await Promise.all([
    page.waitForURL((url) => new URL(url).pathname === '/'),
    page.getByRole('button', { name: '← Library' }).click(),
  ]);
}
