import { getPayload } from 'payload'
import config from '@payload-config'
import {
  Header,
  HeroSection,
  ProductsSection,
  AboutSection,
  TestimonialsSection,
  Footer,
} from '@/components/sections'

export default async function HomePage() {
  const payload = await getPayload({ config })

  // Pobierz produkty z Payload CMS
  const { docs: products } = await payload.find({
    collection: 'products',
    limit: 8,
    sort: '-createdAt',
    depth: 1, // Pobierz powiązane media
  })

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <ProductsSection products={products} />
      <AboutSection />
      <TestimonialsSection />
      <Footer />
    </main>
  )
}
