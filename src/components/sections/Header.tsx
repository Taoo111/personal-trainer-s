'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { User, LogOut, LayoutDashboard, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

const navLinks = [
  { href: '#products', label: 'Produkty' },
  { href: '#about', label: 'O mnie' },
  { href: '#testimonials', label: 'Opinie' },
]

interface AuthUser {
  id: number
  email: string
}

export function Header() {
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Sprawdź stan zalogowania
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/users/me', {
          credentials: 'include',
        })
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        } else {
          setUser(null)
        }
      } catch {
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await fetch('/api/users/logout', {
        method: 'POST',
        credentials: 'include',
      })
      setUser(null)
      setIsMobileMenuOpen(false)
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Blokuj scroll gdy menu jest otwarte
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || isMobileMenuOpen
            ? 'bg-background/95 backdrop-blur-md border-b border-border'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold text-foreground z-10">
              TRAINER
              <span className="bg-gradient-to-r from-gold to-amber bg-clip-text text-transparent">
                PRO
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-gold transition-colors text-sm font-medium tracking-wide uppercase"
                >
                  {link.label}
                </a>
              ))}
              
              {/* Auth Links */}
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-border">
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                ) : user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors text-sm font-medium"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Panel
                    </Link>
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-gold transition-colors text-sm font-medium disabled:opacity-50"
                    >
                      {isLoggingOut ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <LogOut className="w-4 h-4" />
                      )}
                      Wyloguj
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors text-sm font-medium"
                    >
                      <User className="w-4 h-4" />
                      Zaloguj
                    </Link>
                    <Link
                      href="/register"
                      className="px-5 py-2 bg-gradient-to-r from-gold to-amber text-background text-sm font-semibold rounded-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300"
                    >
                      Dołącz
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center text-foreground z-10"
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6">
                <span
                  className={`absolute left-0 block w-6 h-0.5 bg-current transform transition-all duration-300 ease-out ${
                    isMobileMenuOpen ? 'top-3 rotate-45' : 'top-1'
                  }`}
                />
                <span
                  className={`absolute left-0 top-3 block w-6 h-0.5 bg-current transition-all duration-300 ease-out ${
                    isMobileMenuOpen ? 'opacity-0 translate-x-2' : 'opacity-100'
                  }`}
                />
                <span
                  className={`absolute left-0 block w-6 h-0.5 bg-current transform transition-all duration-300 ease-out ${
                    isMobileMenuOpen ? 'top-3 -rotate-45' : 'top-5'
                  }`}
                />
              </div>
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Menu - Full Screen Overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ease-out ${
          isMobileMenuOpen ? 'visible' : 'invisible'
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-background/98 backdrop-blur-lg transition-opacity duration-500 ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Content - Slide from right */}
        <div
          className={`relative z-10 flex flex-col items-center justify-center h-full gap-6 px-6 transition-all duration-500 ease-out ${
            isMobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}
        >
          {navLinks.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-foreground hover:text-gold transition-all duration-300 text-3xl font-medium tracking-wide uppercase"
              style={{
                transitionDelay: isMobileMenuOpen ? `${150 + index * 75}ms` : '0ms',
                transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(20px)',
                opacity: isMobileMenuOpen ? 1 : 0,
              }}
            >
              {link.label}
            </a>
          ))}
          
          {/* Mobile Auth Buttons */}
          <div
            className="flex flex-col gap-4 mt-8 w-full max-w-xs"
            style={{
              transitionDelay: isMobileMenuOpen ? `${150 + navLinks.length * 75}ms` : '0ms',
              transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(20px)',
              opacity: isMobileMenuOpen ? 1 : 0,
            }}
          >
            {isLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-4 bg-gradient-to-r from-gold to-amber text-background text-lg font-semibold rounded-xl text-center hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Mój panel
                </Link>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full py-4 border border-border text-foreground text-lg font-semibold rounded-xl text-center hover:border-gold hover:text-gold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoggingOut ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <LogOut className="w-5 h-5" />
                  )}
                  Wyloguj się
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-4 border border-border text-foreground text-lg font-semibold rounded-xl text-center hover:border-gold hover:text-gold transition-all duration-300"
                >
                  Zaloguj się
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-4 bg-gradient-to-r from-gold to-amber text-background text-lg font-semibold rounded-xl text-center hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all duration-300"
                >
                  Zarejestruj się
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
