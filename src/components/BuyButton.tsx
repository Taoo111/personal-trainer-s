'use client'

import { useState } from 'react'
import { ShoppingCart, Loader2 } from 'lucide-react'
import { createCheckoutSession } from '@/actions/checkout'

interface BuyButtonProps {
  productId: number
  className?: string
}

export function BuyButton({ productId, className = '' }: BuyButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClick = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await createCheckoutSession({ productId })

      if (result.error) {
        setError(result.error)
        return
      }

      if (result.url) {
        // Przekieruj do Stripe Checkout
        window.location.href = result.url
      }
    } catch (err) {
      setError('Wystąpił nieoczekiwany błąd')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={`flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-gradient-to-r hover:from-gold hover:to-amber text-foreground hover:text-background rounded-lg text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ShoppingCart className="w-4 h-4" />
        )}
        <span>{isLoading ? 'Ładowanie...' : 'Kup teraz'}</span>
      </button>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}
