'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ProductError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Loguj błąd do serwisu raportowania (np. Sentry)
    console.error('Product page error:', error)
  }, [error])

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-red-500/10 flex items-center justify-center">
          <AlertTriangle className="w-12 h-12 text-red-500" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-foreground mb-4">Wystąpił błąd</h1>

        {/* Description */}
        <p className="text-muted-foreground mb-8">
          Przepraszamy, coś poszło nie tak podczas ładowania produktu. Spróbuj ponownie lub wróć do
          strony głównej.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gold to-amber text-background font-semibold rounded-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300"
          >
            <RefreshCw className="w-4 h-4" />
            Spróbuj ponownie
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border text-foreground font-semibold rounded-lg hover:border-gold hover:text-gold transition-all duration-300"
          >
            <Home className="w-4 h-4" />
            Strona główna
          </Link>
        </div>

        {/* Error digest for debugging */}
        {error.digest && (
          <p className="mt-8 text-xs text-muted-foreground">
            Kod błędu: <code className="bg-secondary px-2 py-1 rounded">{error.digest}</code>
          </p>
        )}
      </div>
    </main>
  )
}
