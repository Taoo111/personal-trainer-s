import type { Page } from '@playwright/test'

export class HomePage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/')
  }

  getHeaderLogo() {
    return this.page.getByRole('navigation').getByRole('link', { name: /TRAINER\s*PRO/i })
  }

  getHeroHeading() {
    return this.page.getByRole('heading', { level: 1, name: /ZMIEŃ SWOJE/i })
  }

  getProductsSection() {
    return this.page.locator('#products')
  }

  getProductsSectionHeading() {
    return this.page.getByRole('heading', { name: /POPULARNE PLANY/i })
  }

  getLoginLink() {
    return this.page.getByRole('link', { name: /Zaloguj/i })
  }

  getRegisterLink() {
    return this.page.getByRole('link', { name: /Dołącz|Zarejestruj/i }).first()
  }

  async goToLogin() {
    await this.getLoginLink().click()
  }

  async goToRegister() {
    await this.getRegisterLink().click()
  }
}
