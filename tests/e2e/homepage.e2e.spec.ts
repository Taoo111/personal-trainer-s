import { test, expect } from '@playwright/test'
import { HomePage } from './page-objects/HomePage'

test.describe('Strona główna', () => {
  test('wyświetla poprawny tytuł i logo', async ({ page }) => {
    // Arrange
    const homePage = new HomePage(page)
    // Act
    await homePage.goto()
    // Assert
    await expect(page).toHaveTitle(/TrainerPro/)
    await expect(homePage.getHeaderLogo()).toBeVisible()
  })

  test('wyświetla sekcję hero z nagłówkiem', async ({ page }) => {
    const homePage = new HomePage(page)
    await homePage.goto()
    await expect(homePage.getHeroHeading()).toBeVisible()
    await expect(homePage.getHeroHeading()).toContainText('ZMIEŃ SWOJE')
  })

  test('wyświetla sekcję produktów', async ({ page }) => {
    const homePage = new HomePage(page)
    await homePage.goto()
    await expect(homePage.getProductsSection()).toBeVisible()
    await expect(homePage.getProductsSectionHeading()).toBeVisible()
  })

  test('zawiera linki do logowania i rejestracji w nagłówku', async ({ page }) => {
    const homePage = new HomePage(page)
    await homePage.goto()
    await expect(homePage.getLoginLink()).toBeVisible()
    await expect(homePage.getRegisterLink()).toBeVisible()
  })

  test('nawigacja do logowania prowadzi na /login', async ({ page }) => {
    const homePage = new HomePage(page)
    await homePage.goto()
    await homePage.goToLogin()
    await expect(page).toHaveURL(/\/login/)
  })

  test('nawigacja do rejestracji prowadzi na /register', async ({ page }) => {
    const homePage = new HomePage(page)
    await homePage.goto()
    await homePage.goToRegister()
    await expect(page).toHaveURL(/\/register/)
  })
})
