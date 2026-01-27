import React from 'react'
import './styles.css'

export const metadata = {
  title: 'TrainerPro | Profesjonalne plany treningowe i diety',
  description:
    'Premium plany treningowe i diety stworzone przez certyfikowanego trenera personalnego. Osiągnij swoje cele fitness z naukowo potwierdzonymi metodami.',
  keywords: ['trener personalny', 'plan treningowy', 'dieta', 'fitness', 'transformacja'],
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="pl">
      <body className="min-h-screen">{children}</body>
    </html>
  )
}
