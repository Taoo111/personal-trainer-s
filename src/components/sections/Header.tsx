'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { href: '#products', label: 'Produkty' },
  { href: '#about', label: 'O mnie' },
  { href: '#testimonials', label: 'Opinie' },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/95 backdrop-blur-md border-b border-border' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-foreground">
            TRAINER
            <span className="bg-gradient-to-r from-gold to-amber bg-clip-text text-transparent">PRO</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-gold transition-colors text-sm font-medium tracking-wide uppercase"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#products"
              className="px-6 py-2.5 bg-gradient-to-r from-gold to-amber text-background text-sm font-semibold rounded-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300"
            >
              Zacznij teraz
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center text-foreground"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-muted-foreground hover:text-gold transition-colors text-sm font-medium tracking-wide uppercase py-2"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#products"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-6 py-3 bg-gradient-to-r from-gold to-amber text-background text-sm font-semibold rounded-lg text-center mt-2"
              >
                Zacznij teraz
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
