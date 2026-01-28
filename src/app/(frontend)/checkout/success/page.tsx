import Link from 'next/link'
import { CheckCircle, Download, Mail } from 'lucide-react'
import { stripe } from '@/lib/stripe'
import { getPayload } from 'payload'
import config from '@payload-config'

interface PageProps {
  searchParams: Promise<{ session_id?: string }>
}

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  const params = await searchParams
  const sessionId = params.session_id

  let customerEmail: string | null = null
  let productTitle: string | null = null

  if (sessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId)
      customerEmail = session.customer_details?.email || session.customer_email || null

      // Pobierz nazwę produktu z metadanych
      const payloadProductId = session.metadata?.payloadProductId
      if (payloadProductId) {
        const payload = await getPayload({ config })
        const product = await payload.findByID({
          collection: 'products',
          id: Number(payloadProductId),
        })
        productTitle = product?.title || null
      }
    } catch (error) {
      console.error('Error retrieving session:', error)
    }
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-gold to-amber flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-background" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
          Dziękujemy za zakup!
        </h1>

        {productTitle && (
          <p className="text-xl text-gold mb-2">{productTitle}</p>
        )}

        <p className="text-muted-foreground mb-8">
          Twoje zamówienie zostało pomyślnie zrealizowane.
        </p>

        {/* Info Cards */}
        <div className="space-y-4 mb-8">
          <div className="bg-card border border-border rounded-xl p-4 flex items-start gap-4 text-left">
            <Mail className="w-6 h-6 text-gold flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground mb-1">Email z plikiem</h3>
              <p className="text-sm text-muted-foreground">
                Link do pobrania został wysłany na adres{' '}
                {customerEmail ? (
                  <span className="text-gold">{customerEmail}</span>
                ) : (
                  'podany podczas płatności'
                )}
              </p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 flex items-start gap-4 text-left">
            <Download className="w-6 h-6 text-gold flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground mb-1">Panel klienta</h3>
              <p className="text-sm text-muted-foreground">
                Możesz też pobrać pliki logując się do panelu klienta używając emaila z zakupu.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-gold to-amber text-background font-semibold rounded-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300"
          >
            Wróć do sklepu
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-3 border border-border text-foreground font-semibold rounded-lg hover:border-gold hover:text-gold transition-all duration-300"
          >
            Panel klienta
          </Link>
        </div>
      </div>
    </main>
  )
}
