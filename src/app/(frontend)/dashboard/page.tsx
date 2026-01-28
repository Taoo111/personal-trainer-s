import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Package, Download, User } from 'lucide-react'
import { LogoutButton } from '@/components/LogoutButton'
import type { Order, Product, Media } from '@/payload-types'

export default async function DashboardPage() {
  const payload = await getPayload({ config })

  // Pobierz użytkownika z sesji
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value

  if (!token) {
    redirect('/login')
  }

  // Weryfikuj token i pobierz użytkownika
  let user
  try {
    const { user: authUser } = await payload.auth({ headers: new Headers({ Cookie: `payload-token=${token}` }) })
    user = authUser
  } catch {
    redirect('/login')
  }

  if (!user) {
    redirect('/login')
  }

  // Pobierz zamówienia użytkownika
  const { docs: orders } = await payload.find({
    collection: 'orders',
    where: {
      orderedBy: { equals: user.id },
      status: { equals: 'paid' },
    },
    depth: 2,
    sort: '-createdAt',
  })

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-bold text-foreground">
              TRAINER
              <span className="bg-gradient-to-r from-gold to-amber bg-clip-text text-transparent">
                PRO
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="w-4 h-4" />
                <span className="text-sm">{user.email}</span>
              </div>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-foreground mb-2">Panel klienta</h1>
        <p className="text-muted-foreground mb-8">Tutaj znajdziesz swoje zakupione produkty.</p>

        {/* Purchases */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
            <Package className="w-5 h-5 text-gold" />
            Moje zakupy ({orders.length})
          </h2>

          {orders.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">Nie masz jeszcze żadnych zakupów.</p>
              <Link
                href="/#products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold to-amber text-background font-semibold rounded-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300"
              >
                Przeglądaj produkty
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

function OrderCard({ order }: { order: Order }) {
  const orderDate = new Date(order.createdAt).toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <p className="text-sm text-muted-foreground">Zamówienie z dnia</p>
          <p className="font-medium text-foreground">{orderDate}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Suma</p>
          <p className="font-bold text-gold">
            {new Intl.NumberFormat('pl-PL', {
              style: 'currency',
              currency: 'PLN',
            }).format(order.total / 100)}
          </p>
        </div>
      </div>

      <div className="border-t border-border pt-4 space-y-3">
        {order.items?.map((item) => {
          const product = item.product as Product
          const productFile = product?.productFile
          const fileUrl =
            typeof productFile === 'object' && productFile?.url ? productFile.url : null

          return (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 p-3 bg-secondary/50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                {product?.image && typeof product.image === 'object' && (
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary">
                    {(product.image as Media).url && (
                      <img
                        src={(product.image as Media).url!}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                )}
                <div>
                  <p className="font-medium text-foreground">{product?.title || 'Produkt'}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Intl.NumberFormat('pl-PL', {
                      style: 'currency',
                      currency: 'PLN',
                    }).format(item.price / 100)}
                  </p>
                </div>
              </div>

              {fileUrl && (
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gold/10 text-gold hover:bg-gold hover:text-background rounded-lg text-sm font-medium transition-all"
                >
                  <Download className="w-4 h-4" />
                  Pobierz
                </a>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
