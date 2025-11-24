import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { storyCoverTemplateData } from '../../src/data/storyCoverTemplateData';
import { beatTemplateData } from '../../src/data/beatTemplateData';
import type { BeatCategory, StoryCoverCategory } from '../../src/types/story';

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const asRegex = (value: string) => new RegExp(escapeRegExp(value), 'i');

const groupTemplatesByCategory = <T extends { category: string }>(templates: T[]) =>
  templates.reduce<Map<string, T[]>>((acc, template) => {
    const next = acc.get(template.category) ?? [];
    next.push(template);
    acc.set(template.category, next);
    return acc;
  }, new Map());

const coverTemplatesByCategory = groupTemplatesByCategory(storyCoverTemplateData);
const beatTemplatesByCategory = groupTemplatesByCategory(beatTemplateData);

const getCoverTitle = (category: StoryCoverCategory, index: number) => {
  const template = coverTemplatesByCategory.get(category)?.[index];
  if (!template) throw new Error(`Cover template not found for category ${category} at index ${index}`);
  return template.title;
};

const getBeatTitle = (category: BeatCategory, index: number) => {
  const template = beatTemplatesByCategory.get(category)?.[index];
  if (!template) throw new Error(`Beat template not found for category ${category} at index ${index}`);
  return template.title;
};

const firstEgoCoverTitle = getCoverTitle('ego', 0);
const firstSoulCoverTitle = getCoverTitle('soul', 0);
const firstReturnBeatTitle = getBeatTitle('return', 0);
const thirdReturnBeatTitle = getBeatTitle('return', 2);
const firstDepartureBeatTitle = getBeatTitle('departure', 0);
const secondDepartureBeatTitle = getBeatTitle('departure', 1);

test.describe('Story flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('tsw-stories', JSON.stringify([]));
    });
    await page.reload();
    await expect(page.getByText('The Story Within')).toBeVisible();
    await expect(page.getByText('No stories yet. Start with your first spark.')).toBeVisible();
  });

  test.describe('Story cover workflows', () => {
    test('creates and saves a new story cover', async ({ page }) => {
      const storyName = await createStory(page, {
        notes: 'Testing the cover creation workflow.',
        coverName: firstEgoCoverTitle,
      });

      await expect(page.getByRole('button', { name: new RegExp(storyName, 'i') })).toBeVisible();
    });

    test('discarding a draft cover returns to the library without persisting it', async ({ page }) => {
      await page.getByRole('button', { name: '+ New story' }).click();
      await expect(page.locator('.beat-card__visual')).toBeVisible();

      await Promise.all([
        page.waitForURL((url) => new URL(url).pathname === '/'),
        page.getByRole('button', { name: 'Cancel' }).click(),
      ]);

      await expect(page.locator('.story-card')).toHaveCount(0);
      await expect(page.getByText('No stories yet. Start with your first spark.')).toBeVisible();
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
      const storyName = await createStory(page, { notes: 'Initial notes', coverName: firstEgoCoverTitle });
      await openStory(page, storyName);
      await page.getByRole('button', { name: /View cover/i }).click();
      await page.getByRole('button', { name: /Edit cover/i }).click();

      await page.getByLabel('Your story notes').fill('Updated intentions for the journey.');
      await page.getByRole('button', { name: asRegex(firstSoulCoverTitle) }).click();
      await page.getByRole('button', { name: 'Save' }).click();

      await waitForStoryView(page);
      await returnToLibrary(page);
      await expect(page.getByRole('button', { name: asRegex(firstSoulCoverTitle) })).toBeVisible();

      await openStory(page, firstSoulCoverTitle);
      await expect(page.getByRole('heading', { name: firstSoulCoverTitle })).toBeVisible();
      await expect(page.getByText('Updated intentions for the journey.')).toBeVisible();

      await page.reload();
      await expect(page.getByRole('heading', { name: firstSoulCoverTitle })).toBeVisible();
      await expect(page.getByText('Updated intentions for the journey.')).toBeVisible();
    });

    test('deletes a story from the cover editor', async ({ page }) => {
      const storyName = await createStory(page, { notes: 'Delete me', coverName: firstSoulCoverTitle });
      await openStory(page, storyName);
      await page.getByRole('button', { name: /View cover/i }).click();
      await page.getByRole('button', { name: /Edit cover/i }).click();

      page.once('dialog', (dialog) => dialog.accept());
      await page.getByRole('button', { name: 'Delete' }).click();

      await expect(page.getByText('The Story Within')).toBeVisible();
      await expect(page.locator('.story-card')).toHaveCount(0);
      await expect(page.getByText('No stories yet. Start with your first spark.')).toBeVisible();
    });
  });

  test.describe('Beat workflows', () => {
    test('adds a beat from the library and saves it', async ({ page }) => {
      const storyName = await createStory(page, { notes: 'Ready for beats', coverName: firstEgoCoverTitle });
      await openStory(page, storyName);
      await expect(page.getByRole('heading', { name: storyName })).toBeVisible();

      await page.getByRole('button', { name: /New Story Beat/i }).click();

      await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();
      await page.getByRole('button', { name: asRegex(firstReturnBeatTitle) }).click();
      await page.getByLabel('Your notes').fill('Fresh beat from the hero’s journey.');

      await page.getByRole('button', { name: 'Save' }).click();
      await expect(page.getByRole('button', { name: 'Save' })).toHaveCount(0);

      await navigateBackToStory(page);

      const beats = page.locator('.story-view__beat');
      await expect(beats).toHaveCount(1);
      await expect(page.getByText(firstReturnBeatTitle)).toBeVisible();
    });

    test('edits an existing beat and persists changes', async ({ page }) => {
      const storyName = await createStory(page, { notes: 'Needs beats', coverName: firstEgoCoverTitle });
      await openStory(page, storyName);
      await addBeatToStory(page, {
        templateName: firstDepartureBeatTitle,
        notes: 'Starting point.',
      });

      const firstBeat = page.locator('.story-view__beat').first();
      await firstBeat.click();

      await page.getByRole('button', { name: 'Edit' }).click();
      await page.getByLabel('Your notes').fill('Refocusing the journey on gratitude.');
      await page.getByRole('button', { name: asRegex(thirdReturnBeatTitle) }).click();

      await page.getByRole('button', { name: 'Save' }).click();
      await expect(page.getByRole('button', { name: 'Save' })).toHaveCount(0);

      await navigateBackToStory(page);

      const updatedBeat = page.locator('.story-view__beat').first();
      await expect(updatedBeat.getByRole('heading', { name: thirdReturnBeatTitle })).toBeVisible();
      await expect(updatedBeat.getByText('Refocusing the journey on gratitude.')).toBeVisible();

      await updatedBeat.click();
      await expect(page.getByLabel('Your notes')).toHaveText('Refocusing the journey on gratitude.');
    });

    test('guards against losing unsaved beat edits', async ({ page }) => {
      const storyName = await createStory(page, { coverName: firstEgoCoverTitle });
      await openStory(page, storyName);
      await addBeatToStory(page, {
        templateName: firstDepartureBeatTitle,
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

    test('discarding a new beat removes the draft and returns to the story', async ({ page }) => {
      const storyName = await createStory(page, { coverName: firstEgoCoverTitle });
      await openStory(page, storyName);

      await page.getByRole('button', { name: /New Story Beat/i }).click();
      await expect(page.getByLabel('Your notes')).toBeVisible();

      await Promise.all([
        page.waitForURL(storyPathRegex),
        page.getByRole('button', { name: 'Cancel' }).click(),
      ]);

      await expect(page.locator('.story-view__beat')).toHaveCount(0);
    });

    test('deletes a beat and returns to the story view', async ({ page }) => {
      const storyName = await createStory(page, { coverName: firstEgoCoverTitle });
      await openStory(page, storyName);
      await addBeatToStory(page, {
        templateName: firstDepartureBeatTitle,
        notes: 'First beat',
      });
      await addBeatToStory(page, {
        templateName: secondDepartureBeatTitle,
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
  { notes = '', coverName = firstEgoCoverTitle }: { notes?: string; coverName?: string }
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
