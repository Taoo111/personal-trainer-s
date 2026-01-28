import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn (utils)', () => {
  it('łączy pojedyncze klasy', () => {
    expect(cn('foo')).toBe('foo')
  })

  it('łączy wiele klas', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('pomija wartości falsy', () => {
    expect(cn('foo', undefined, null, false, 'bar')).toBe('foo bar')
  })

  it('merguje konfliktujące klasy Tailwind (twMerge)', () => {
    // p-2 i p-4 → zostaje p-4
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })

  it('obsługuje obiekty warunkowe', () => {
    expect(cn('base', { active: true, disabled: false })).toBe('base active')
  })

  it('obsługuje tablice', () => {
    expect(cn(['a', 'b'], 'c')).toBe('a b c')
  })
})
