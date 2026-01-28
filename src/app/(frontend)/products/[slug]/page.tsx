import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ArrowLeft, FileText, Shield, Zap } from 'lucide-react'
import type { Metadata } from 'next'
import type { Product, Media } from '@/payload-types'
import { Header, Footer } from '@/components/sections'
import { BuyButton } from '@/components/BuyButton'

interface PageProps {
  params: Promise<{ slug: string }>
}

// Generowanie statycznych ścieżek dla SSG
export async function generateStaticParams() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'products',
    limit: 100,
    select: { slug: true },
  })

  return docs.map((product) => ({
    slug: product.slug,
  }))
}

// Metadata dla SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })

  const product = docs[0]

  if (!product) {
    return {
      title: 'Produkt nie znaleziony | TrainerPro',
    }
  }

  const description = extractTextFromRichText(product.description)
  const imageUrl = getImageUrl(product.image)

  return {
    title: `${product.title} | TrainerPro`,
    description: description || `Kup ${product.title} - profesjonalny plan od TrainerPro`,
    openGraph: {
      title: product.title,
      description: description || `Kup ${product.title}`,
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
  }
}

// Pomocnicze funkcje
function getImageUrl(image: Product['image']): string | null {
  if (!image) return null
  if (typeof image === 'number') return null
  return (image as Media).url ?? null
}

function extractTextFromRichText(description: Product['description']): string {
  if (!description?.root?.children) return ''

  const extractText = (node: unknown): string => {
    if (typeof node !== 'object' || node === null) return ''
    const n = node as { text?: string; children?: unknown[] }
    if (n.text) return n.text
    if (n.children) return n.children.map(extractText).join('')
    return ''
  }

  return description.root.children.map(extractText).join(' ').slice(0, 200)
}

function formatPrice(priceInCents: number): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
  }).format(priceInCents / 100)
}

// Komponent renderujący RichText
function RichTextContent({ content }: { content: Product['description'] }) {
  if (!content?.root?.children) return null

  const renderNode = (node: unknown, index: number): React.ReactNode => {
    if (typeof node !== 'object' || node === null) return null

    const n = node as {
      type?: string
      text?: string
      children?: unknown[]
      format?: number
    }

    // Tekst
    if (n.text !== undefined) {
      let text: React.ReactNode = n.text

      // Formatowanie tekstu
      if (n.format) {
        if (n.format & 1) text = <strong key={index}>{text}</strong>
        if (n.format & 2) text = <em key={index}>{text}</em>
      }

      return text
    }

    // Elementy blokowe
    const children = n.children?.map((child, i) => renderNode(child, i))

    switch (n.type) {
      case 'paragraph':
        return (
          <p key={index} className="mb-4 text-muted-foreground leading-relaxed">
            {children}
          </p>
        )
      case 'heading':
        return (
          <h3 key={index} className="text-xl font-semibold text-foreground mb-3 mt-6">
            {children}
          </h3>
        )
      case 'list':
        return (
          <ul key={index} className="list-disc list-inside mb-4 text-muted-foreground space-y-2">
            {children}
          </ul>
        )
      case 'listitem':
        return <li key={index}>{children}</li>
      default:
        return children
    }
  }

  return <div>{content.root.children.map((node, i) => renderNode(node, i))}</div>
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })

  const product = docs[0]

  if (!product) {
    notFound()
  }

  const imageUrl = getImageUrl(product.image)
  const imageAlt =
    product.image && typeof product.image === 'object' ? (product.image as Media).alt : product.title

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Spacer for fixed header */}
      <div className="h-20" />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link
          href="/#products"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Wróć do produktów
        </Link>
      </div>

      {/* Product Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Product Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-secondary border border-border">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FileText className="w-24 h-24 text-muted-foreground/30" />
                </div>
              )}
            </div>

            {/* Decorative element */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-gold/20 to-amber/20 rounded-2xl -z-10 blur-2xl" />
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {/* Title & Price */}
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                {product.title}
              </h1>
              <p className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gold to-amber bg-clip-text text-transparent">
                {formatPrice(product.price)}
              </p>
            </div>

            {/* Description */}
            <div className="mb-8 flex-grow">
              <h2 className="text-lg font-semibold text-foreground mb-4">Opis produktu</h2>
              {product.description ? (
                <RichTextContent content={product.description} />
              ) : (
                <p className="text-muted-foreground">
                  Profesjonalny produkt cyfrowy stworzony przez doświadczonego trenera personalnego.
                </p>
              )}
            </div>

            {/* Features */}
            <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl border border-border">
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Natychmiastowy dostęp</p>
                  <p className="text-xs text-muted-foreground">Po zakupie od razu otrzymasz plik</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl border border-border">
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Bezpieczna płatność</p>
                  <p className="text-xs text-muted-foreground">Stripe - certyfikowana platforma</p>
                </div>
              </div>
            </div>

            {/* Buy Button */}
            <div className="space-y-4">
              <BuyButton
                productId={product.id}
                className="w-full justify-center py-4 text-lg"
              />
              <p className="text-center text-xs text-muted-foreground">
                Klikając &quot;Kup teraz&quot; zostaniesz przekierowany do bezpiecznej płatności Stripe
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
