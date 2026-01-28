# Stripe Integration Flow & Automation

## 1. Purchase Initiation
* Użytkownik klika "Kup teraz" na stronie produktu.
* Frontend wywołuje Server Action `createCheckoutSession`.
* System przekazuje `priceId` produktu oraz `email` użytkownika (jeśli podany).
* Metadane sesji Stripe są uzupełniane o `payloadProductId` (aby powiązać płatność z produktem w CMS).

## 2. Payment Processing (Stripe Hosted Page)
* Użytkownik jest przekierowywany na stronę Stripe.
* Dokonuje płatności (Karta/BLIK/Apple Pay).

## 3. Fulfillment (Webhook Strategy)
* Stripe wysyła zdarzenie `checkout.session.completed` na nasz endpoint `/api/stripe/webhook`.
* Webhook weryfikuje podpis (Signature Verification).
* **System Actions:**
    1. Znajduje lub tworzy użytkownika w Payload (na podst. emaila).
    2. Tworzy rekord w kolekcji `Orders` ze statusem "Paid".
    3. Wysyła wiadomość e-mail z linkiem do pobrania pliku (używając Payload Email Adapter).

## 4. Security
* Webhook Secret weryfikowany przy każdym żądaniu.
* Linki do plików wygasają lub wymagają autoryzacji.