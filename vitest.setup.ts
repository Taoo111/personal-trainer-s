// Any setup scripts you might need go here

// Load .env files
import 'dotenv/config'

// Rozszerzenie expect o matchery DOM (toBeInTheDocument, etc.)
import '@testing-library/jest-dom/vitest'

// React Testing Library cleanup
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
})
