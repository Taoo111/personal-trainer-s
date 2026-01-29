import type { Payload } from 'payload'
import type { Order, Product, ProductFile } from '@/payload-types'

const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3003'

function toAbsoluteUrl(path: string): string {
  if (path.startsWith('http')) return path
  const base = appUrl.replace(/\/$/, '')
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}

/**
 * Wysyła email do klienta z potwierdzeniem zakupu i linkami do pobrania kursu.
 */
export async function sendPurchaseEmail(
  payload: Payload,
  options: {
    to: string
    order: Order
    product: Product & { productFile: ProductFile }
  },
): Promise<void> {
  const { to, order, product } = options
  const productTitle = product.title
  const fileUrl =
    typeof product.productFile === 'object' && product.productFile?.url
      ? toAbsoluteUrl(product.productFile.url)
      : null
  const dashboardUrl = toAbsoluteUrl('/dashboard')

  const subject = `Zakup powiódł się: ${productTitle}`
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 560px; margin: 0 auto; padding: 24px;">
  <h1 style="color: #1a1a1a; margin-bottom: 8px;">Dziękujemy za zakup!</h1>
  <p style="margin-bottom: 24px;">Twoje zamówienie zostało opłacone. Poniżej znajdziesz dostęp do zakupionego kursu.</p>

  <div style="background: #f5f5f5; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
    <p style="margin: 0 0 8px; font-weight: 600;">${productTitle}</p>
    <p style="margin: 0; font-size: 14px; color: #666;">
      Suma: ${new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(order.total / 100)}
    </p>
  </div>

  <p style="margin-bottom: 16px;">Możesz pobrać materiały na dwa sposoby:</p>

  ${fileUrl ? `
  <p style="margin-bottom: 8px;">
    <a href="${fileUrl}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(to right, #d4af37, #f59e0b); color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600;">Pobierz plik kursu</a>
  </p>
  ` : ''}

  <p style="margin-bottom: 24px;">
    <a href="${dashboardUrl}" style="color: #d4af37; text-decoration: underline;">Wejdź do panelu klienta</a> – tam zawsze znajdziesz swoje zakupy i linki do pobrania (po zalogowaniu emailem z zakupu).
  </p>

  <p style="font-size: 14px; color: #666; margin-top: 32px;">
    W razie pytań odpisz na ten email.<br>
    Pozdrawiamy,<br>
    Trainer Pro
  </p>
</body>
</html>
  `.trim()

  const text = [
    `Dziękujemy za zakup!`,
    ``,
    `Zakupiony kurs: ${productTitle}`,
    `Suma: ${new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(order.total / 100)}`,
    ``,
    fileUrl ? `Link do pobrania: ${fileUrl}` : '',
    ``,
    `Panel klienta (logowanie emailem z zakupu): ${dashboardUrl}`,
    ``,
    `Pozdrawiamy, Trainer Pro`,
  ]
    .filter(Boolean)
    .join('\n')

  await payload.sendEmail({
    to,
    subject,
    html,
    text,
  })
}
