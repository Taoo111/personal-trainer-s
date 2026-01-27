'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Michał Kowalski',
    role: 'Schudł 20 kg w 12 tygodni',
    quote:
      'Program 12-tygodniowy całkowicie odmienił moje życie. Treningi były wymagające, ale idealnie dopasowane. Nigdy nie czułem się silniejszy.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Anna Nowak',
    role: 'Biegaczka',
    quote:
      'Dieta sama w sobie była warta każdych pieniędzy. W końcu plan żywieniowy, który nie ogranicza wszystkiego, a nadal daje rezultaty.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Tomasz Wiśniewski',
    role: 'Przybrał 10 kg mięśni',
    quote:
      'Po latach stagnacji, program siłowy pomógł mi przebić wszystkie bariery. Naukowe podejście i skuteczność.',
    rating: 5,
  },
  {
    id: 4,
    name: 'Katarzyna Mazur',
    role: 'Zapracowana menadżerka',
    quote:
      'Jako osoba z zerową ilością czasu, potrzebowałam czegoś efektywnego. Programy idealnie wpasowały się w mój grafik i dały niesamowite efekty.',
    rating: 5,
  },
]

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goTo = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    setIsAutoPlaying(false)
  }

  return (
    <section id="testimonials" className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-gold font-medium tracking-[0.3em] uppercase text-sm mb-4">Opinie</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            PRAWDZIWE REZULTATY
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Nie wierz mi na słowo. Zobacz co mówią moi klienci.
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-card border border-border rounded-2xl p-8 sm:p-12 relative">
                    {/* Quote Icon */}
                    <Quote className="absolute top-6 right-6 w-12 h-12 text-gold/20" />

                    {/* Stars */}
                    <div className="flex gap-1 mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                      ))}
                    </div>

                    {/* Quote */}
                    <blockquote className="text-lg sm:text-xl text-foreground leading-relaxed mb-8">
                      &ldquo;{testimonial.quote}&rdquo;
                    </blockquote>

                    {/* Author */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-amber flex items-center justify-center text-background font-bold text-lg">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{testimonial.name}</div>
                        <div className="text-sm text-gold">{testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-12 w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:border-gold hover:text-gold transition-colors"
            aria-label="Poprzednia opinia"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-12 w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:border-gold hover:text-gold transition-colors"
            aria-label="Następna opinia"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 bg-gradient-to-r from-gold to-amber'
                    : 'bg-muted hover:bg-muted-foreground'
                }`}
                aria-label={`Przejdź do opinii ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
