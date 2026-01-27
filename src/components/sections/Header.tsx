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
          <a
            href="#products"
            onClick={() => setIsMobileMenuOpen(false)}
            className="px-10 py-4 bg-gradient-to-r from-gold to-amber text-background text-xl font-semibold rounded-xl text-center mt-6 hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all duration-300"
            style={{
              transitionDelay: isMobileMenuOpen ? `${150 + navLinks.length * 75}ms` : '0ms',
              transform: isMobileMenuOpen ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
              opacity: isMobileMenuOpen ? 1 : 0,
            }}
          >
            Zacznij teraz
          </a>
        </div>
      </div>
    </>
  )
}
