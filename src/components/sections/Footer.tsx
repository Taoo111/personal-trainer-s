import Link from 'next/link'
import { Instagram, Youtube, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="py-12 bg-card border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-foreground">
            TRAINER
            <span className="bg-gradient-to-r from-gold to-amber bg-clip-text text-transparent">
              PRO
            </span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-gold transition-colors">
              Polityka prywatności
            </Link>
            <Link href="/terms" className="hover:text-gold transition-colors">
              Regulamin
            </Link>
            <Link href="/contact" className="hover:text-gold transition-colors">
              Kontakt
            </Link>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-gold hover:bg-gold/10 transition-all"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-gold hover:bg-gold/10 transition-all"
              aria-label="YouTube"
            >
              <Youtube className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-gold hover:bg-gold/10 transition-all"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} TrainerPro. Wszelkie prawa zastrzeżone.</p>
        </div>
      </div>
    </footer>
  )
}
