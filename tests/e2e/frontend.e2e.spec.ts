import { test, expect } from '@playwright/test'
import { HomePage } from './page-objects/HomePage'

test.describe('Frontend – ogólne', () => {
  test('strona główna ładuje się i ma tytuł TrainerPro', async ({ page }) => {
    const homePage = new HomePage(page)
    await homePage.goto()
    await expect(page).toHaveTitle(/TrainerPro/)
  })

  test('strona główna wyświetla treść (hero lub sekcję produktów)', async ({ page }) => {
    const homePage = new HomePage(page)
    await homePage.goto()
    const heroOrProducts = page.locator('main').first()
    await expect(heroOrProducts).toBeVisible()
  })
})
