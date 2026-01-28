import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BuyButton } from '@/components/BuyButton'

const mockCreateCheckoutSession = vi.fn()
vi.mock('@/actions/checkout', () => ({
  createCheckoutSession: (...args: unknown[]) => mockCreateCheckoutSession(...args),
}))

describe('BuyButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
  })

  it('renderuje przycisk z tekstem "Kup teraz"', () => {
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ ok: false })
    render(<BuyButton productId={1} />)
    expect(screen.getByRole('button', { name: /kup teraz/i })).toBeInTheDocument()
  })

  it('wyświetla "Ładowanie..." po kliknięciu', async () => {
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ ok: false })
    mockCreateCheckoutSession.mockImplementation(() => new Promise(() => {}))
    render(<BuyButton productId={1} />)
    const button = screen.getByRole('button', { name: /kup teraz/i })
    fireEvent.click(button)
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /ładowanie/i })).toBeInTheDocument()
    })
  })

  it('wywołuje createCheckoutSession z productId po kliknięciu', async () => {
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ ok: false })
    mockCreateCheckoutSession.mockResolvedValueOnce({})
    render(<BuyButton productId={42} />)
    fireEvent.click(screen.getByRole('button', { name: /kup teraz/i }))
    await waitFor(() => {
      expect(mockCreateCheckoutSession).toHaveBeenCalledWith({
        productId: 42,
        customerEmail: undefined,
      })
    })
  })

  it('wyświetla komunikat błędu gdy createCheckoutSession zwraca error', async () => {
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ ok: false })
    mockCreateCheckoutSession.mockResolvedValueOnce({
      error: 'Produkt nie został znaleziony',
    })
    render(<BuyButton productId={1} />)
    fireEvent.click(screen.getByRole('button', { name: /kup teraz/i }))
    await waitFor(() => {
      expect(screen.getByText('Produkt nie został znaleziony')).toBeInTheDocument()
    })
  })

  it('przekazuje customerEmail gdy użytkownik zalogowany', async () => {
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ user: { email: 'test@example.com' } }),
    })
    mockCreateCheckoutSession.mockResolvedValueOnce({})
    render(<BuyButton productId={1} />)
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/users/me', { credentials: 'include' })
    })
    fireEvent.click(screen.getByRole('button', { name: /kup teraz/i }))
    await waitFor(() => {
      expect(mockCreateCheckoutSession).toHaveBeenCalledWith({
        productId: 1,
        customerEmail: 'test@example.com',
      })
    })
  })

  it('przycisk jest disabled podczas ładowania', async () => {
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ ok: false })
    mockCreateCheckoutSession.mockImplementation(() => new Promise(() => {}))
    render(<BuyButton productId={1} />)
    const button = screen.getByRole('button', { name: /kup teraz/i })
    fireEvent.click(button)
    await waitFor(() => {
      expect(button).toBeDisabled()
    })
  })
})
