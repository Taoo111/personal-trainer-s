# Plan Implementacji Widoku: Product Detail Page

## 1. Przegląd

Strona szczegółów produktu (`/product/[slug]`) to kluczowy widok konwersji w e-commerce platformy trenera personalnego. Użytkownik trafia tu z listy produktów na stronie głównej, aby zapoznać się ze szczegółami i dokonać zakupu.

## 2. Routing

- **Ścieżka:** `/product/[slug]`
- **Plik:** `src/app/(frontend)/product/[slug]/page.tsx`
- **Typ:** Server Component (SSG z revalidation)
- **Parametr dynamiczny:** `slug` (URL-friendly nazwa produktu)

## 3. Struktura komponentów

```
ProductDetailPage (Server Component)
├── Header (istniejący)
├── ProductHero
│   ├── ProductImage
│   └── ProductInfo
│       ├── ProductTitle
│       ├── ProductPrice
│       ├── ProductDescription (RichText)
│       └── BuyButton (istniejący Client Component)
├── ProductFeatures (opcjonalnie)
├── RelatedProducts (opcjonalnie)
└── Footer (istniejący)
```

## 4. Szczegóły komponentów

### 4.1 ProductDetailPage (Server Component)

**Odpowiedzialność:** Pobieranie danych produktu i renderowanie layoutu

**Props:** Brak (dane z params)

**Logika:**

```typescript
// Pobieranie produktu po slug
const product = await payload.find({
  collection: 'products',
  where: { slug: { equals: params.slug } },
  depth: 1, // Pobierz powiązane media
  limit: 1,
})

// 404 jeśli nie znaleziono
if (!product.docs[0]) notFound()
```

### 4.2 ProductImage

**Odpowiedzialność:** Wyświetlanie zdjęcia produktu z optymalizacją

**Props:**

```typescript
interface ProductImageProps {
  image: Media | null
  title: string
}
```

**Funkcjonalność:**

- Next.js Image z optymalizacją
- Placeholder blur dla ładowania
- Fallback dla brakującego zdjęcia

### 4.3 ProductInfo

**Odpowiedzialność:** Sekcja z informacjami o produkcie

**Props:**

```typescript
interface ProductInfoProps {
  product: Product
}
```

**Zawartość:**

- Tytuł produktu (h1)
- Cena (formatowana jako PLN)
- Opis (RichText z Lexical)
- BuyButton z przekazanym productId

### 4.4 BuyButton (istniejący)

**Lokalizacja:** `src/components/BuyButton.tsx`
**Typ:** Client Component ('use client')

**Props:**

```typescript
interface BuyButtonProps {
  productId: number
  price: number
  title: string
}
```

## 5. Typy danych

### Z Payload Types (payload-types.ts):

```typescript
interface Product {
  id: number
  title: string
  slug: string
  description?: LexicalRichText | null
  price: number // w groszach
  stripeProductId?: string | null
  stripePriceId?: string | null
  productFile: number | ProductFile
  image?: (number | null) | Media
  updatedAt: string
  createdAt: string
}

interface Media {
  id: number
  alt: string
  url?: string | null
  width?: number | null
  height?: number | null
}
```

## 6. Pobieranie danych

### Endpoint: Payload Local API

```typescript
// GET /product/[slug] - Server Component
import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })

const { docs } = await payload.find({
  collection: 'products',
  where: {
    slug: { equals: slug },
  },
  depth: 1,
  limit: 1,
})
```

### Generowanie statycznych ścieżek:

```typescript
export async function generateStaticParams() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'products',
    limit: 100,
    select: { slug: true },
  })

  return docs.map((product) => ({
    slug: product.slug,
  }))
}
```

### Metadata dla SEO:

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProduct(params.slug)

  return {
    title: `${product.title} | TrainerPro`,
    description: extractTextFromRichText(product.description),
    openGraph: {
      images: [product.image?.url],
    },
  }
}
```

## 7. Zarządzanie stanem

### Stan lokalny (Client Components):

- **BuyButton:** `isLoading` podczas tworzenia sesji Stripe
- **Quantity selector:** (opcjonalnie) `quantity` dla ilości

### Brak globalnego stanu - widok jest Server Component z minimalnymi interakcjami.

## 8. Walidacja i obsługa błędów

### Walidacja parametrów:

```typescript
// Sprawdzenie czy slug istnieje
if (!params.slug || typeof params.slug !== 'string') {
  notFound()
}
```

### Obsługa błędów:

| Scenariusz             | Akcja                     |
| ---------------------- | ------------------------- |
| Produkt nie istnieje   | `notFound()` → strona 404 |
| Błąd pobierania danych | Wyświetl error boundary   |
| Brak zdjęcia produktu  | Wyświetl placeholder      |
| Błąd Stripe checkout   | Toast z komunikatem błędu |

### Error Boundary:

```typescript
// error.tsx w folderze product/[slug]/
'use client'

export default function ProductError({ error, reset }) {
  return (
    <div className="text-center py-20">
      <h2>Wystąpił błąd</h2>
      <button onClick={reset}>Spróbuj ponownie</button>
    </div>
  )
}
```

## 9. Stylowanie

### Podejście: Tailwind CSS + komponenty shadcn/ui

### Struktura layoutu:

```
┌────────────────────────────────────────┐
│              Header                     │
├────────────────────────────────────────┤
│  ┌──────────────┐  ┌─────────────────┐ │
│  │              │  │ Title           │ │
│  │   Product    │  │ Price           │ │
│  │    Image     │  │ Description     │ │
│  │              │  │ [Buy Button]    │ │
│  └──────────────┘  └─────────────────┘ │
├────────────────────────────────────────┤
│              Footer                     │
└────────────────────────────────────────┘
```

### Klasy Tailwind:

```typescript
// Kontener główny
className = 'container mx-auto px-4 py-12'

// Grid dla desktop (2 kolumny)
className = 'grid grid-cols-1 lg:grid-cols-2 gap-12'

// Zdjęcie produktu
className = 'aspect-square rounded-2xl overflow-hidden bg-secondary'

// Cena
className = 'text-3xl font-bold text-gold'

// Przycisk zakupu
className =
  'w-full py-4 bg-gradient-to-r from-gold to-amber text-background font-semibold rounded-lg'
```

## 10. Plan implementacji krok po kroku

### Krok 1: Struktura plików

```bash
src/app/(frontend)/product/
├── [slug]/
│   ├── page.tsx        # Główna strona
│   ├── loading.tsx     # Skeleton loader
│   ├── not-found.tsx   # Strona 404
│   └── error.tsx       # Error boundary
```

### Krok 2: Implementacja page.tsx

1. Import zależności (getPayload, config, komponenty)
2. Implementacja `generateStaticParams()` dla SSG
3. Implementacja `generateMetadata()` dla SEO
4. Główny komponent z pobieraniem danych
5. Render layoutu z sekcjami

### Krok 3: Komponenty pomocnicze

1. `ProductImage` - zdjęcie z Next/Image
2. `ProductDescription` - renderowanie RichText z Lexical
3. `PriceDisplay` - formatowanie ceny

### Krok 4: Integracja z BuyButton

1. Przekazanie productId, price, title do BuyButton
2. Upewnienie się, że endpoint `/api/checkout` działa

### Krok 5: Responsywność

1. Mobile-first approach
2. Breakpointy: sm (640px), md (768px), lg (1024px)
3. Stack na mobile, grid na desktop

### Krok 6: Loading i Error states

1. `loading.tsx` z skeleton UI
2. `error.tsx` z możliwością retry
3. `not-found.tsx` ze stylowym 404

### Krok 7: Testowanie

1. Test ścieżki happy path
2. Test 404 dla nieistniejącego produktu
3. Test responsywności
4. Test integracji z Stripe (checkout flow)

## 11. Metryki sukcesu

- [ ] Strona ładuje się < 2s (LCP)
- [ ] Wszystkie produkty dostępne pod `/product/[slug]`
- [ ] SEO metadata poprawnie generowane
- [ ] Przycisk "Kup" inicjuje sesję Stripe
- [ ] Responsywność na wszystkich urządzeniach
- [ ] Obsługa błędów i 404

## 12. Zależności

- `next/image` - optymalizacja obrazów
- `@payloadcms/richtext-lexical` - renderowanie opisu
- `lucide-react` - ikony
- Istniejący `BuyButton` komponent
- Istniejące `Header` i `Footer` komponenty
