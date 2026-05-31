import { test, expect } from '@playwright/test'

test('homepage loads with Carefinder branding', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText(/carefinder/i).first()).toBeVisible()
})

test('Find Hospitals CTA navigates to search', async ({ page }) => {
  await page.goto('/')
  await page
    .getByRole('link', { name: /find hospitals/i })
    .first()
    .click()
  await expect(page).toHaveURL(/\/search/)
})

test('search page loads with correct heading', async ({ page }) => {
  await page.goto('/search')
  await expect(
    page.getByRole('heading', { name: /find hospitals/i })
  ).toBeVisible()
})

test('search bar accepts input', async ({ page }) => {
  await page.goto('/search')
  const searchInput = page.getByRole('searchbox').first()
  await searchInput.fill('Lagos')
  await expect(searchInput).toHaveValue('Lagos')
})

test('admin login page loads', async ({ page }) => {
  await page.goto('/admin/login')
  await expect(
    page.getByRole('heading', { name: /admin login/i })
  ).toBeVisible()
})

test('unauthenticated admin dashboard redirects to login', async ({ page }) => {
  await page.goto('/admin/dashboard')
  await expect(page).toHaveURL(/\/admin\/login/)
})

test('export button opens modal', async ({ page }) => {
  await page.goto('/search')
  await page.waitForTimeout(1500)
  const exportBtn = page
    .getByRole('button', { name: /export results/i })
    .first()
  if (await exportBtn.isVisible()) {
    await exportBtn.click()
    await expect(
      page.getByRole('heading', { name: /export as csv/i })
    ).toBeVisible()
  }
})
