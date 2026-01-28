import { test, expect } from '@playwright/test'
import { HomePage } from './page-objects/HomePage'
import { ProductPage } from './page-objects/ProductPage'

test.describe('Produkty', () => {
  test('nieistniejący slug wyświetla stronę 404 (Produkt nie znaleziony)', async ({ page }) => {
    const productPage = new ProductPage(page)
    await productPage.goto('nieistniejacy-produkt-12345')
    await expect(page.getByRole('heading', { name: /produkt nie znaleziony/i })).toBeVisible({
      timeout: 5000,
    })
  })
})

test.describe('Nawigacja strona główna → produkt', () => {
  test('kliknięcie w produkt na stronie głównej prowadzi do strony produktu', async ({
    page,
  }) => {
    const homePage = new HomePage(page)
    await homePage.goto()
    const firstProductLink = page.locator('a[href^="/products/"]').first()
    const count = await firstProductLink.count()
    if (count === 0) {
      test.skip()
      return
    }
    await firstProductLink.click()
    await expect(page).toHaveURL(/\/products\//)
  })
})
