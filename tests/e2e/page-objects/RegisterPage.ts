import type { Page } from '@playwright/test'

export class RegisterPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/register')
  }

  getEmailInput() {
    return this.page.getByLabel(/email/i).first()
  }

  getPasswordInput() {
    return this.page.getByLabel(/^hasło/i)
  }

  getConfirmPasswordInput() {
    return this.page.getByLabel(/potwierdź hasło/i)
  }

  getSubmitButton() {
    return this.page.getByRole('button', { name: /zarejestruj się/i })
  }

  getLoginLink() {
    return this.page.getByRole('link', { name: /zaloguj się/i })
  }

  getErrorMessage() {
    return this.page.locator('[class*="red-500"]').filter({ hasText: /.+/ })
  }

  getSuccessMessage() {
    return this.page.getByText(/konto utworzone|przekierowywanie/i)
  }

  async register(email: string, password: string, confirmPassword: string) {
    await this.getEmailInput().fill(email)
    await this.getPasswordInput().fill(password)
    await this.getConfirmPasswordInput().fill(confirmPassword)
    await this.getSubmitButton().click()
  }
}
