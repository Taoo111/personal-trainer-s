import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  typescript: true,
})

/**
 * Formatuje cenę z groszy na format Stripe (też grosze, ale jako number)
 */
export function formatAmountForStripe(amount: number): number {
  return Math.round(amount)
}

/**
 * Formatuje cenę z groszy na wyświetlanie (PLN)
 */
export function formatAmountForDisplay(amount: number): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
  }).format(amount / 100)
}
