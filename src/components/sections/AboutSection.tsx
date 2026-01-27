import Image from 'next/image'
import { Award, Users, Calendar, Target } from 'lucide-react'

const stats = [
  { icon: Users, value: '2,500+', label: 'Zadowolonych klientów' },
  { icon: Calendar, value: '10+', label: 'Lat doświadczenia' },
  { icon: Award, value: 'Certyfikat', label: 'Trener personalny' },
  { icon: Target, value: '98%', label: 'Skuteczność' },
]

export function AboutSection() {
  return (
    <section id="about" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <Image
                src="/images/trainer-about.jpg"
                alt="Trener personalny"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </div>
            {/* Decorative Border */}
            <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-gold/30 rounded-2xl -z-10" />
          </div>

          {/* Content */}
          <div>
            <p className="text-gold font-medium tracking-[0.3em] uppercase text-sm mb-4">O mnie</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
              DLACZEGO
              <span className="block bg-gradient-to-r from-gold to-amber bg-clip-text text-transparent">
                WARTO ZE MNĄ?
              </span>
            </h2>

            <div className="space-y-4 text-muted-foreground leading-relaxed mb-8">
              <p>
                Jestem certyfikowanym trenerem personalnym i specjalistą od żywienia z ponad 10
                letnim doświadczeniem w transformacji sylwetek i budowaniu zdrowych nawyków.
              </p>
              <p>
                Moja metodologia łączy sprawdzone zasady treningowe z praktycznymi strategiami
                żywieniowymi, które pasują do Twojego stylu życia.
              </p>
              <p>
                Pracowałem z setkami osób - od zapracowanych profesjonalistów po sportowców
                amatorów. Wiem, że trwałe rezultaty wymagają inteligentnego podejścia.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="text-center p-4 bg-card rounded-xl border border-border"
                >
                  <stat.icon className="w-6 h-6 text-gold mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
