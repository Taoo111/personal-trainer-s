import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LoginPage from '@/app/(frontend)/login/page'

const mockPush = vi.fn()
const mockRefresh = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}))

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
  })

  it('renderuje formularz z polami email i hasło', () => {
    render(<LoginPage />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/hasło/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /zaloguj się/i })).toBeInTheDocument()
  })

  it('renderuje link do rejestracji', () => {
    render(<LoginPage />)
    const link = screen.getByRole('link', { name: /zarejestruj się/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/register')
  })

  it('wyświetla komunikat błędu przy nieprawidłowych danych (401)', async () => {
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: () => Promise.resolve({}),
    })
    render(<LoginPage />)
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText(/hasło/i), { target: { value: 'wrongpassword' } })
    fireEvent.click(screen.getByRole('button', { name: /zaloguj się/i }))
    await waitFor(() => {
      expect(screen.getByText(/nieprawidłowy email lub hasło/i)).toBeInTheDocument()
    })
  })

  it('wyświetla komunikat sukcesu i przekierowuje po poprawnym logowaniu', async () => {
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    })
    render(<LoginPage />)
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@example.com' } })
    fireEvent.change(screen.getByLabelText(/hasło/i), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: /zaloguj się/i }))
    await waitFor(() => {
      expect(screen.getByText(/zalogowano pomyślnie/i)).toBeInTheDocument()
    })
    await waitFor(
      () => {
        expect(mockPush).toHaveBeenCalledWith('/dashboard')
      },
      { timeout: 1000 },
    )
  })

  it('wywołuje POST /api/users/login z email i hasłem', async () => {
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({}),
    })
    render(<LoginPage />)
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@test.pl' } })
    fireEvent.change(screen.getByLabelText(/hasło/i), { target: { value: 'secret123' } })
    fireEvent.click(screen.getByRole('button', { name: /zaloguj się/i }))
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'user@test.pl', password: 'secret123' }),
        credentials: 'include',
      })
    })
  })
})
