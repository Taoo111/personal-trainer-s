import { test, expect } from '@playwright/test'
import { LoginPage } from './page-objects/LoginPage'
import { RegisterPage } from './page-objects/RegisterPage'

test.describe('Logowanie', () => {
  test('strona logowania wyświetla formularz', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await expect(loginPage.getEmailInput()).toBeVisible()
    await expect(loginPage.getPasswordInput()).toBeVisible()
    await expect(loginPage.getSubmitButton()).toBeVisible()
  })

  test('strona logowania zawiera link do rejestracji', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await expect(loginPage.getRegisterLink()).toBeVisible()
    await expect(loginPage.getRegisterLink()).toHaveAttribute('href', '/register')
  })

  test('nieprawidłowe dane wyświetlają komunikat błędu', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.login('nieistniejacy@example.com', 'zlehaslo123')
    await expect(loginPage.getErrorMessage()).toBeVisible({ timeout: 10000 })
  })
})

test.describe('Rejestracja', () => {
  test('strona rejestracji wyświetla formularz z trzema polami', async ({ page }) => {
    const registerPage = new RegisterPage(page)
    await registerPage.goto()
    await expect(registerPage.getEmailInput()).toBeVisible()
    await expect(registerPage.getPasswordInput()).toBeVisible()
    await expect(registerPage.getConfirmPasswordInput()).toBeVisible()
    await expect(registerPage.getSubmitButton()).toBeVisible()
  })

  test('strona rejestracji zawiera link do logowania', async ({ page }) => {
    const registerPage = new RegisterPage(page)
    await registerPage.goto()
    await expect(registerPage.getLoginLink()).toBeVisible()
    await expect(registerPage.getLoginLink()).toHaveAttribute('href', '/login')
  })

  test('różne hasła wyświetlają błąd walidacji', async ({ page }) => {
    const registerPage = new RegisterPage(page)
    await registerPage.goto()
    await registerPage.register('test@example.com', 'password123', 'innehaseo')
    await expect(page.getByText(/hasła nie są identyczne/i)).toBeVisible({ timeout: 5000 })
  })

  test('hasło krótsze niż 8 znaków wyświetla błąd', async ({ page }) => {
    const registerPage = new RegisterPage(page)
    await registerPage.goto()
    await page.evaluate(() => {
      const el = document.getElementById('password')
      if (el) el.removeAttribute('minLength')
    })
    await registerPage.register('test@example.com', 'short', 'short')
    await expect(page.getByText(/hasło musi mieć co najmniej 8 znaków/i)).toBeVisible({
      timeout: 10000,
    })
  })
})
