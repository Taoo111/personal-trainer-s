/**
 * Formatuje cenę z groszy na string PLN (locale pl-PL).
 * Używane w ProductCard, stronie produktu, Dashboard.
 */
export function formatPrice(priceInCents: number): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
  }).format(priceInCents / 100)
}
