import type { Page } from '@playwright/test'

export class ProductPage {
  constructor(private readonly page: Page) {}

  async goto(slug: string) {
    await this.page.goto(`/products/${slug}`)
  }

  getProductTitle() {
    return this.page.getByRole('heading', { level: 1 })
  }

  getBuyButton() {
    return this.page.getByRole('button', { name: /kup teraz/i })
  }

  getBackToProductsLink() {
    return this.page.getByRole('link', { name: /wróć do produktów/i })
  }

  getPrice() {
    return this.page.locator('text=/\\d+,\\d+\\s*zł/')
  }
}
