# Database Schema Design (Payload CMS)

## 1. Collection: Users (Auth enabled)
Reprezentuje administratorów oraz klientów.
* `email` (login)
* `roles`: ['admin', 'customer']
* `purchases`: Relationship (One-to-Many) do kolekcji Orders

## 2. Collection: Products
Produkty cyfrowe sprzedawane w sklepie.
* `title` (Text)
* `price` (Number)
* `stripeProductId` (Text) - ID produktu w Stripe
* `stripePriceId` (Text) - ID ceny w Stripe
* `productFile` (Upload) - Plik PDF/Zip z planem (zabezpieczony dostęp)
* `image` (Upload) - Okładka
* `slug` (Text) - do URL

## 3. Collection: Orders
Historia zamówień.
* `status`: ['pending', 'paid', 'failed']
* `total` (Number)
* `orderedBy`: Relationship do Users (opcjonalne, jeśli gość)
* `customerEmail` (Text) - kopia maila dla szybkich wyszukiwań
* `items`: Array
    * `product`: Relationship do Products
* `stripeSessionId` (Text) - do weryfikacji płatności