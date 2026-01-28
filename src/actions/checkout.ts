'use server'

import { stripe } from '@/lib/stripe'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Product } from '@/payload-types'

interface CreateCheckoutSessionInput {
  productId: number
  customerEmail?: string
}

interface CheckoutSessionResult {
  sessionId?: string
  url?: string
  error?: string
}

export async function createCheckoutSession(
  input: CreateCheckoutSessionInput,
): Promise<CheckoutSessionResult> {
  try {
    const payload = await getPayload({ config })

    // Pobierz produkt z Payload
    const product = await payload.findByID({
      collection: 'products',
      id: input.productId,
      depth: 1,
    })

    if (!product) {
      return { error: 'Produkt nie został znaleziony' }
    }

    // Sprawdź czy produkt ma stripePriceId
    // Jeśli nie, utwórz sesję z ceną inline
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3003'

    const lineItems = product.stripePriceId
      ? [{ price: product.stripePriceId, quantity: 1 }]
      : [
          {
            price_data: {
              currency: 'pln',
              product_data: {
                name: product.title,
                description: `Produkt cyfrowy: ${product.title}`,
              },
              unit_amount: product.price, // Cena w groszach
            },
            quantity: 1,
          },
        ]

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card', 'blik', 'p24'],
      line_items: lineItems,
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/products/${product.slug}`,
      metadata: {
        payloadProductId: String(product.id),
      },
      ...(input.customerEmail && { customer_email: input.customerEmail }),
    })

    return {
      sessionId: session.id,
      url: session.url ?? undefined,
    }
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return {
      error: error instanceof Error ? error.message : 'Wystąpił błąd podczas tworzenia sesji',
    }
  }
}
