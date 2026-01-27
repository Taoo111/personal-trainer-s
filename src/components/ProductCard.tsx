import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import type { Product, Media } from '@/payload-types'

interface ProductCardProps {
  product: Product
  badge?: string | null
}

/**
 * Wyodrębnia URL obrazka z pola Media Payload
 */
function getImageUrl(image: Product['image']): string | null {
  if (!image) return null
  if (typeof image === 'number') return null // Tylko ID, brak URL
  return (image as Media).url ?? null
}

/**
 * Formatuje cenę z groszy na PLN
 */
function formatPrice(priceInCents: number): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
  }).format(priceInCents / 100)
}

/**
 * Wyodrębnia tekst z rich text description
 */
function getDescriptionText(description: Product['description']): string {
  if (!description?.root?.children) return ''

  const extractText = (node: unknown): string => {
    if (typeof node !== 'object' || node === null) return ''
    const n = node as { text?: string; children?: unknown[] }
    if (n.text) return n.text
    if (n.children) return n.children.map(extractText).join('')
    return ''
  }

  return description.root.children.map(extractText).join(' ').slice(0, 150)
}

export function ProductCard({ product, badge }: ProductCardProps) {
  const imageUrl = getImageUrl(product.image)

  return (
    <div className="group relative bg-card rounded-xl overflow-hidden border border-border hover:border-gold/30 transition-all duration-300 hover:shadow-[0_0_40px_rgba(212,175,55,0.1)]">
      {/* Badge */}
      {badge && (
        <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-gradient-to-r from-gold to-amber text-background text-xs font-semibold rounded-full">
          {badge}
        </div>
      )}

      {/* Image */}
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-secondary flex items-center justify-center">
              <span className="text-muted-foreground">Brak zdjęcia</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        </div>
      </Link>

      {/* Content */}
      <div className="p-6">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-gold transition-colors">
            {product.title}
          </h3>
        </Link>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {getDescriptionText(product.description)}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold bg-gradient-to-r from-gold to-amber bg-clip-text text-transparent">
            {formatPrice(product.price)}
          </span>
          <Link
            href={`/checkout?product=${product.id}`}
            className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-gradient-to-r hover:from-gold hover:to-amber text-foreground hover:text-background rounded-lg text-sm font-medium transition-all duration-300"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Kup teraz</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
