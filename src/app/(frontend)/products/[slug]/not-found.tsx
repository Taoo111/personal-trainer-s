import Link from 'next/link'
import { PackageX, ArrowLeft, Home } from 'lucide-react'

export default function ProductNotFound() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-secondary flex items-center justify-center">
          <PackageX className="w-12 h-12 text-muted-foreground" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-foreground mb-4">Produkt nie znaleziony</h1>

        {/* Description */}
        <p className="text-muted-foreground mb-8">
          Przepraszamy, ale produkt którego szukasz nie istnieje lub został usunięty.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/#products"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gold to-amber text-background font-semibold rounded-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Przeglądaj produkty
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border text-foreground font-semibold rounded-lg hover:border-gold hover:text-gold transition-all duration-300"
          >
            <Home className="w-4 h-4" />
            Strona główna
          </Link>
        </div>
      </div>
    </main>
  )
}
