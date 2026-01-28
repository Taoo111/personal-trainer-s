import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import RegisterPage from '@/app/(frontend)/register/page'

const mockPush = vi.fn()
const mockRefresh = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}))

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
  })

  it('renderuje formularz z polami email, hasło, potwierdzenie hasła', () => {
    render(<RegisterPage />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^hasło/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/potwierdź hasło/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /zarejestruj się/i })).toBeInTheDocument()
  })

  it('renderuje link do logowania', () => {
    render(<RegisterPage />)
    const link = screen.getByRole('link', { name: /zaloguj się/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/login')
  })

  it('wyświetla błąd gdy hasła nie są identyczne', async () => {
    render(<RegisterPage />)
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'new@example.com' } })
    fireEvent.change(screen.getByLabelText(/^hasło/i), { target: { value: 'password123' } })
    fireEvent.change(screen.getByLabelText(/potwierdź hasło/i), { target: { value: 'different' } })
    fireEvent.click(screen.getByRole('button', { name: /zarejestruj się/i }))
    await waitFor(() => {
      expect(screen.getByText(/hasła nie są identyczne/i)).toBeInTheDocument()
    })
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('wyświetla błąd gdy hasło ma mniej niż 8 znaków', async () => {
    render(<RegisterPage />)
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'new@example.com' } })
    fireEvent.change(screen.getByLabelText(/^hasło/i), { target: { value: 'short' } })
    fireEvent.change(screen.getByLabelText(/potwierdź hasło/i), { target: { value: 'short' } })
    fireEvent.click(screen.getByRole('button', { name: /zarejestruj się/i }))
    await waitFor(() => {
      expect(screen.getByText(/hasło musi mieć co najmniej 8 znaków/i)).toBeInTheDocument()
    })
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('wyświetla błąd gdy email już istnieje (400)', async () => {
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: () =>
        Promise.resolve({
          errors: [{ path: 'email' }],
        }),
    })
    render(<RegisterPage />)
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'existing@example.com' } })
    fireEvent.change(screen.getByLabelText(/^hasło/i), { target: { value: 'password123' } })
    fireEvent.change(screen.getByLabelText(/potwierdź hasło/i), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: /zarejestruj się/i }))
    await waitFor(() => {
      expect(screen.getByText(/konto z tym adresem email już istnieje/i)).toBeInTheDocument()
    })
  })

  it('wyświetla sukces i przekierowuje po udanej rejestracji i logowaniu', async () => {
    ;(global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({ ok: true })
      .mockResolvedValueOnce({ ok: true })
    render(<RegisterPage />)
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'newuser@example.com' } })
    fireEvent.change(screen.getByLabelText(/^hasło/i), { target: { value: 'password123' } })
    fireEvent.change(screen.getByLabelText(/potwierdź hasło/i), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: /zarejestruj się/i }))
    await waitFor(() => {
      expect(screen.getByText(/konto utworzone/i)).toBeInTheDocument()
    })
    await waitFor(
      () => {
        expect(mockPush).toHaveBeenCalledWith('/dashboard')
      },
      { timeout: 1500 },
    )
  })

  it('wywołuje POST /api/users z email i hasłem przy rejestracji', async () => {
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ errors: [] }),
    })
    render(<RegisterPage />)
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'reg@test.pl' } })
    fireEvent.change(screen.getByLabelText(/^hasło/i), { target: { value: 'validpass123' } })
    fireEvent.change(screen.getByLabelText(/potwierdź hasło/i), { target: { value: 'validpass123' } })
    fireEvent.click(screen.getByRole('button', { name: /zarejestruj się/i }))
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'reg@test.pl', password: 'validpass123' }),
      })
    })
  })
})
