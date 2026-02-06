import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear()
  })
})

test('home loads and can open a book', async ({ page }) => {
  await page.goto('/')

  const firstBook = page.getByRole('button', { name: /Open / }).first()
  await expect(firstBook).toBeVisible()

  await firstBook.click()
  await expect(page).toHaveURL(/\/story-beats\//)

  await expect(
    page.getByText(/No story beats yet\. Add one to begin\.|CALL TO ADVENTURE/i)
  ).toBeVisible()
})

test('can add a beat with a note', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('button', { name: /Open / }).first().click()

  await page.getByRole('button', { name: 'Add a story beat' }).click()
  await expect(page.getByText('Add a story beat')).toBeVisible()

  await page.locator('textarea').fill('A short note')
  await page.getByRole('button', { name: 'Save' }).click()

  await expect(page.getByText('A short note')).toBeVisible()
})

test('chat shows config hint when api key is missing', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('button', { name: 'Open story chatbot' }).click()

  await expect(
    page.getByText(/AI chat is disabled \(missing VITE_OPENAI_API_KEY\)/)
  ).toBeVisible()
  await expect(page.getByRole('textbox', { name: 'Chat input' })).toBeDisabled()
})
