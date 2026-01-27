'use client'

import Image from 'next/image'
import { ChevronDown } from 'lucide-react'

export function HeroSection() {
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-trainer.jpg"
          alt="Personal Trainer"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl">
          <p className="text-gold font-medium tracking-[0.3em] uppercase text-sm mb-4">
            Trening Personalny
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6 text-balance">
            ZMIEŃ SWOJE
            <span className="block bg-gradient-to-r from-gold to-amber bg-clip-text text-transparent">
              CIAŁO I UMYSŁ
            </span>
          </h1>
          <p className="text-muted-foreground text-lg sm:text-xl mb-10 max-w-xl leading-relaxed">
            Profesjonalne plany treningowe i diety stworzone z myślą o realnych, trwałych
            rezultatach. Bez skrótów. Bez trików. Tylko sprawdzona wiedza.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={scrollToProducts}
              className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-background bg-gradient-to-r from-gold to-amber rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:scale-105"
            >
              <span className="relative z-10">Rozpocznij transformację</span>
            </button>
            <a
              href="#about"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-foreground border border-border rounded-lg hover:border-gold/50 hover:text-gold transition-all duration-300"
            >
              Dowiedz się więcej
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <ChevronDown className="w-8 h-8 text-gold/60" />
      </div>
    </section>
  )
}
