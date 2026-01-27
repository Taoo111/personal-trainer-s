import type { Product } from '@/payload-types'
import { ProductCard } from '@/components/ProductCard'

interface ProductsSectionProps {
  products: Product[]
}

export function ProductsSection({ products }: ProductsSectionProps) {
  return (
    <section id="products" className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-gold font-medium tracking-[0.3em] uppercase text-sm mb-4">Sklep</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            POPULARNE PLANY
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Profesjonalnie zaprojektowane programy poparte nauką i realnymi wynikami.
          </p>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                badge={index === 0 ? 'Bestseller' : index === products.length - 1 ? 'Nowość' : null}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Brak produktów. Dodaj produkty w panelu admina.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
