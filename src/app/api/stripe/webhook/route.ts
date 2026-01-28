import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { getPayload } from 'payload'
import config from '@payload-config'
import type Stripe from 'stripe'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request: Request) {
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  // Obsługa zdarzenia checkout.session.completed
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    try {
      await handleCheckoutSessionCompleted(session)
    } catch (error) {
      console.error('Error handling checkout session:', error)
      return NextResponse.json({ error: 'Error processing order' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const payload = await getPayload({ config })

  const customerEmail = session.customer_details?.email || session.customer_email
  const payloadProductId = session.metadata?.payloadProductId

  if (!customerEmail) {
    throw new Error('No customer email in session')
  }

  if (!payloadProductId) {
    throw new Error('No payloadProductId in session metadata')
  }

  // 1. Znajdź lub utwórz użytkownika
  let user = await findOrCreateUser(payload, customerEmail)

  // 2. Pobierz produkt
  const product = await payload.findByID({
    collection: 'products',
    id: Number(payloadProductId),
    overrideAccess: true,
  })

  if (!product) {
    throw new Error(`Product not found: ${payloadProductId}`)
  }

  // 3. Utwórz zamówienie
  const order = await payload.create({
    collection: 'orders',
    data: {
      status: 'paid',
      total: session.amount_total || product.price,
      orderedBy: user.id,
      customerEmail: customerEmail,
      items: [
        {
          product: product.id,
          price: product.price,
        },
      ],
      stripeSessionId: session.id,
    },
    overrideAccess: true,
  })

  // 4. Zaktualizuj zakupy użytkownika
  const existingPurchases = (user.purchases as number[]) || []
  await payload.update({
    collection: 'users',
    id: user.id,
    data: {
      purchases: [...existingPurchases, order.id],
    },
    overrideAccess: true,
  })

  console.log(`Order created: ${order.id} for user: ${user.email}`)

  // TODO: Wysłać email z linkiem do pobrania pliku
  // await sendPurchaseEmail(customerEmail, product, order)
}

async function findOrCreateUser(
  payload: Awaited<ReturnType<typeof getPayload>>,
  email: string,
) {
  // Szukaj istniejącego użytkownika (z overrideAccess bo to operacja serwerowa)
  const existingUsers = await payload.find({
    collection: 'users',
    where: {
      email: { equals: email },
    },
    limit: 1,
    overrideAccess: true, // Ważne: webhook nie ma kontekstu użytkownika
  })

  if (existingUsers.docs.length > 0) {
    console.log(`Found existing user: ${email}`)
    return existingUsers.docs[0]
  }

  // Utwórz nowego użytkownika z losowym hasłem
  const randomPassword = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12)

  const newUser = await payload.create({
    collection: 'users',
    data: {
      email,
      password: randomPassword,
      roles: ['customer'],
    },
    overrideAccess: true, // Ważne: webhook nie ma kontekstu użytkownika
  })

  console.log(`Created new user: ${email}`)

  return newUser
}
