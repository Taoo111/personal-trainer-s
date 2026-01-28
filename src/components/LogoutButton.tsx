'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Loader2 } from 'lucide-react'

export function LogoutButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)

    try {
      await fetch('/api/users/logout', {
        method: 'POST',
        credentials: 'include',
      })

      // Przekieruj na stronę główną
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
      // Mimo błędu, przekieruj na stronę główną
      router.push('/')
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-gold transition-colors disabled:opacity-50"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <LogOut className="w-4 h-4" />
      )}
      Wyloguj
    </button>
  )
}
