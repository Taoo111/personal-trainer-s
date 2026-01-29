// Any setup scripts you might need go here

// Load .env files
import 'dotenv/config'

// Stripe jest importowany przez actions/checkout – w testach jednostkowych nie łączymy się z API.
// Ustaw dummy, żeby moduł nie rzucał przy ładowaniu (CI i lokalnie bez .env).
if (!process.env.STRIPE_SECRET_KEY) {
  process.env.STRIPE_SECRET_KEY = 'sk_test_dummy_for_unit_tests'
}

// Rozszerzenie expect o matchery DOM (toBeInTheDocument, etc.)
import '@testing-library/jest-dom/vitest'

// React Testing Library cleanup
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
})
