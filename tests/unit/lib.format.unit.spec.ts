import { describe, it, expect } from 'vitest'
import { formatPrice } from '@/lib/format'

// Intl.NumberFormat pl-PL używa niełamiącej spacji (U+00A0) przed "zł"
const normalizeSpace = (s: string) => s.replace(/\s/g, ' ')

describe('formatPrice', () => {
  it('formatuje cenę z groszy na PLN', () => {
    expect(normalizeSpace(formatPrice(9900))).toBe('99,00 zł')
  })

  it('formatuje zero', () => {
    expect(normalizeSpace(formatPrice(0))).toBe('0,00 zł')
  })

  it('formatuje kwoty z groszami', () => {
    expect(normalizeSpace(formatPrice(199))).toBe('1,99 zł')
  })

  it('formatuje większe kwoty', () => {
    expect(normalizeSpace(formatPrice(19900))).toBe('199,00 zł')
  })

  it('używa locale pl-PL (spacja przed zł)', () => {
    const result = formatPrice(1000)
    expect(result).toMatch(/\d+,\d{2}\s*zł/)
  })
})
