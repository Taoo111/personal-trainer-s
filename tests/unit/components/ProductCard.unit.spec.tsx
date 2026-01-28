import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProductCard } from '@/components/ProductCard'
import type { Product } from '@/payload-types'

vi.mock('next/image', () => ({
  default: function MockImage({
    src,
    alt,
  }: {
    src: string
    alt: string
  }) {
    return <img src={src} alt={alt} data-testid="product-image" />
  },
}))

vi.mock('next/link', () => ({
  default: function MockLink({
    children,
    href,
  }: {
    children: React.ReactNode
    href: string
  }) {
    return <a href={href}>{children}</a>
  },
}))

const baseProduct: Product = {
  id: 1,
  title: 'Plan treningowy 30 dni',
  slug: 'plan-treningowy-30-dni',
  description: null,
  price: 9900,
  stripeProductId: null,
  stripePriceId: null,
  productFile: 1,
  image: null,
  updatedAt: '2025-01-01T00:00:00.000Z',
  createdAt: '2025-01-01T00:00:00.000Z',
}

describe('ProductCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renderuje tytuł produktu', () => {
    render(<ProductCard product={baseProduct} />)
    expect(screen.getByRole('heading', { level: 3, name: /plan treningowy 30 dni/i })).toBeInTheDocument()
  })

  it('renderuje cenę w PLN', () => {
    render(<ProductCard product={baseProduct} />)
    expect(screen.getByText(/99,00/)).toBeInTheDocument()
  })

  it('zawiera link do strony produktu po slug', () => {
    render(<ProductCard product={baseProduct} />)
    const links = screen.getAllByRole('link', { name: /plan treningowy 30 dni/i })
    expect(links.length).toBeGreaterThan(0)
    const productLink = links.find((l) => l.getAttribute('href') === '/products/plan-treningowy-30-dni')
    expect(productLink).toBeInTheDocument()
  })

  it('wyświetla "Brak zdjęcia" gdy produkt nie ma obrazka', () => {
    render(<ProductCard product={baseProduct} />)
    expect(screen.getByText('Brak zdjęcia')).toBeInTheDocument()
  })

  it('wyświetla badge gdy przekazany', () => {
    render(<ProductCard product={baseProduct} badge="Bestseller" />)
    expect(screen.getByText('Bestseller')).toBeInTheDocument()
  })

  it('nie wyświetla badge gdy nie przekazany', () => {
    render(<ProductCard product={baseProduct} />)
    expect(screen.queryByText('Bestseller')).not.toBeInTheDocument()
  })

  it('renderuje przycisk Kup teraz (BuyButton)', () => {
    render(<ProductCard product={baseProduct} />)
    expect(screen.getByRole('button', { name: /kup teraz/i })).toBeInTheDocument()
  })

  it('wyświetla skrócony opis gdy description ma root.children', () => {
    const productWithDesc: Product = {
      ...baseProduct,
      description: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [{ type: 'text', text: 'Opis planu treningowego na 30 dni.' }],
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      } as Product['description'],
    }
    render(<ProductCard product={productWithDesc} />)
    expect(screen.getByText(/Opis planu treningowego/)).toBeInTheDocument()
  })
})
