import type { Page } from '@playwright/test'

export class LoginPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/login')
  }

  getEmailInput() {
    return this.page.getByLabel(/email/i)
  }

  getPasswordInput() {
    return this.page.getByLabel(/hasło/i)
  }

  getSubmitButton() {
    return this.page.getByRole('button', { name: /zaloguj się/i })
  }

  getRegisterLink() {
    return this.page.getByRole('link', { name: /zarejestruj się/i })
  }

  getErrorMessage() {
    return this.page.getByText(/nieprawidłowy email lub hasło|wystąpił błąd/i)
  }

  getSuccessMessage() {
    return this.page.getByText(/zalogowano pomyślnie/i)
  }

  async login(email: string, password: string) {
    await this.getEmailInput().fill(email)
    await this.getPasswordInput().fill(password)
    await this.getSubmitButton().click()
  }
}
