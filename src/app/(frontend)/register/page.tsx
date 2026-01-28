'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, Mail, Lock, UserPlus } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Walidacja hasła
    if (password !== confirmPassword) {
      setError('Hasła nie są identyczne')
      return
    }

    if (password.length < 6) {
      setError('Hasło musi mieć co najmniej 6 znaków')
      return
    }

    setIsLoading(true)

    try {
      // 1. Utwórz użytkownika
      const registerResponse = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          roles: ['customer'],
        }),
      })

      if (!registerResponse.ok) {
        const data = await registerResponse.json()
        if (registerResponse.status === 400) {
          // Sprawdź czy błąd dotyczy istniejącego emaila
          if (data.errors?.some((err: { path?: string }) => err.path === 'email')) {
            setError('Konto z tym adresem email już istnieje')
          } else {
            setError(data.message || 'Błąd podczas rejestracji')
          }
        } else {
          setError('Wystąpił błąd podczas rejestracji')
        }
        return
      }

      // 2. Automatyczne logowanie
      const loginResponse = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      })

      if (loginResponse.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
      } else {
        // Rejestracja udana, ale logowanie nie - przekieruj do logowania
        setSuccess(true)
        setTimeout(() => {
          router.push('/login')
        }, 1500)
      }
    } catch (err) {
      setError('Wystąpił błąd połączenia. Spróbuj ponownie.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-3xl font-bold text-foreground">
            TRAINER
            <span className="bg-gradient-to-r from-gold to-amber bg-clip-text text-transparent">
              PRO
            </span>
          </Link>
          <p className="text-muted-foreground mt-2">Utwórz nowe konto</p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl p-8">
          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-center">
              Konto utworzone! Przekierowywanie...
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="twoj@email.pl"
                  className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Hasło
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Minimum 6 znaków"
                  className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Potwierdź hasło
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Powtórz hasło"
                  className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || success}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gold to-amber text-background font-semibold rounded-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Rejestracja...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Zarejestruj się
                </>
              )}
            </button>
          </form>

          {/* Terms */}
          <p className="text-xs text-muted-foreground text-center mt-6">
            Rejestrując się, akceptujesz{' '}
            <Link href="/terms" className="text-gold hover:text-amber transition-colors">
              Regulamin
            </Link>{' '}
            oraz{' '}
            <Link href="/privacy" className="text-gold hover:text-amber transition-colors">
              Politykę Prywatności
            </Link>
          </p>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-card text-muted-foreground">lub</span>
            </div>
          </div>

          {/* Login Link */}
          <p className="text-center text-muted-foreground">
            Masz już konto?{' '}
            <Link
              href="/login"
              className="text-gold hover:text-amber transition-colors font-medium"
            >
              Zaloguj się
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <p className="text-center mt-6">
          <Link href="/" className="text-muted-foreground hover:text-gold transition-colors text-sm">
            ← Wróć do strony głównej
          </Link>
        </p>
      </div>
    </main>
  )
}
