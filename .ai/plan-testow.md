# Plan testów – Personal Trainer E-commerce Platform

## 1. Wprowadzenie i cele testowania

Celem testów jest zapewnienie, że platforma e-commerce (sklep trenera personalnego: produkty cyfrowe, płatności Stripe, auth Payload) działa zgodnie z PRD i User Stories (US-001 – US-010). Testy obejmują warstwę jednostkową (logika, helpers), integracyjną (Payload API, baza) oraz E2E (ścieżki użytkownika w przeglądarce).

**Cele:**

- Wykrywanie regresji przed wdrożeniem.
- Pewność, że checkout, rejestracja, logowanie i dashboard działają poprawnie.
- Dokumentacja zachowania systemu przez scenariusze testowe.

---

## 2. Zakres testów

| Obszar              | Zakres                                                              | Typ testów                          |
| ------------------- | ------------------------------------------------------------------- | ----------------------------------- |
| Helpers / util      | `src/lib/utils.ts`, `src/lib/format.ts` (cn, formatPrice)           | Jednostkowe                         |
| Komponenty UI       | BuyButton, ProductCard, formularze (login/register)                 | Jednostkowe (React Testing Library) |
| Akcje serwerowe     | createCheckoutSession (mock Payload/Stripe)                         | Jednostkowe / integracyjne          |
| Payload API         | Kolekcje users, products, orders – odczyt/tworzenie                 | Integracyjne                        |
| Ścieżki użytkownika | Strona główna, produkt, login, register, dashboard, sukces checkout | E2E                                 |

**Poza zakresem (na ten moment):** testy wydajnościowe, testy obciążeniowe, testy bezpieczeństwa (penetracyjne). Webhook Stripe – testy integracyjne z mockiem Stripe.

---

## 3. Typy testów i narzędzia

| Typ          | Narzędzie                      | Środowisko                  | Lokalizacja                    |
| ------------ | ------------------------------ | --------------------------- | ------------------------------ |
| Jednostkowe  | Vitest, @testing-library/react | jsdom                       | `tests/unit/**/*.unit.spec.ts` |
| Integracyjne | Vitest, getPayload (config)    | jsdom + opcjonalnie test DB | `tests/int/**/*.int.spec.ts`   |
| E2E          | Playwright                     | Przeglądarka (Chromium)     | `tests/e2e/**/*.e2e.spec.ts`   |

**Konfiguracja:** `vitest.config.mts` (Vitest), `playwright.config.ts` (Playwright). Ścieżki aliasów z `tsconfig` (np. `@/lib`).

---

## 4. Scenariusze testowe dla kluczowych funkcji

### 4.1 Helpers (testy jednostkowe)

- **cn (utils):** Łączenie klas Tailwind z `clsx` i `twMerge` – przypadki: pojedyncza klasa, wiele klas, konflikt klas (np. `p-2` + `p-4` → `p-4`), wartości undefined/null.
- **formatPrice:** Cena w groszach → string PLN (np. 9900 → "99,00 zł"), locale pl-PL, zero, duże liczby.

### 4.2 Autentykacja

- **Rejestracja:** Walidacja formularza (email, hasło min 8 znaków, potwierdzenie hasła); wywołanie POST /api/users; po sukcesie – automatyczne logowanie i przekierowanie na /dashboard (E2E).
- **Logowanie:** Poprawne dane → cookie, przekierowanie; błędne dane → komunikat błędu (E2E + opcjonalnie test komponentu formularza).
- **Wylogowanie:** Przycisk wylogowania usuwa sesję i przekierowuje (E2E).

### 4.3 Produkty i checkout

- **Lista produktów:** Strona główna zwraca produkty z Payload (int: payload.find products).
- **Strona produktu:** Produkt po slug – istniejący slug zwraca 200, nieistniejący – 404 (E2E lub int).
- **Checkout:** createCheckoutSession – brak produktu → error; produkt bez stripePriceId → line_items price_data; z stripePriceId → line_items price (unit z mockami Payload/Stripe).

### 4.4 Dashboard

- **Dostęp:** Brak sesji → przekierowanie na /login (E2E).
- **Zawartość:** Lista zamówień status=paid dla zalogowanego użytkownika (int: payload.find orders where orderedBy + status paid).

---

## 5. Środowisko testowe

- **Node:** Zgodnie z `package.json` (engines).
- **Jednostkowe / int:** `pnpm run test:unit`, `pnpm run test:int` – bez uruchomionego serwera Next.js.
- **E2E:** `pnpm run test:e2e` – serwer Next.js na porcie z `playwright.config.ts` (np. 3003); opcjonalnie osobna baza testowa (Postgres) i zmienne w `.env.test`.

---

## 6. Harmonogram i kryteria akceptacji

- **Faza 1:** Testy jednostkowe helpers (lib) – kryterium: wszystkie zielone.
- **Faza 2:** Testy jednostkowe komponentów (BuyButton, formularze) – kryterium: główne ścieżki i błędy walidacji.
- **Faza 3:** Rozszerzenie testów integracyjnych (products, orders) – kryterium: zapytania Payload zwracają oczekiwane struktury.
- **Faza 4:** E2E – rejestracja, logowanie, przeglądanie produktu, checkout (mock Stripe lub testowy klucz), dashboard – kryterium: pełna ścieżka bez błędów w logach.

**Kryteria wejścia na produkcję:** test:unit i test:int przechodzą; test:e2e przechodzi dla ścieżek krytycznych (co najmniej: strona główna, jeden produkt, login, dashboard).

---

## 7. Role i odpowiedzialności

- **Developer:** Pisanie i utrzymanie testów jednostkowych i integracyjnych oraz naprawa testów po zmianach w kodzie.
- **QA (jeśli w zespole):** Scenariusze E2E, raportowanie błędów, weryfikacja kryteriów akceptacji.
- **Code review:** Sprawdzenie, czy nowe funkcje mają pokrycie testami zgodnie z planem.

---

## 8. Procedury raportowania błędów

- Błędy z testów: opis kroków, oczekiwany vs aktualny wynik, fragment kodu/testu, środowisko (Node, przeglądarka).
- Priorytety: krytyczne (checkout, auth) → wysokie (dashboard, produkty) → średnie/niskie (kosmetyka, edge case’y).
- Regresje: powiązanie z commitem/PR i ponowne uruchomienie odpowiedniego poziomu testów (unit / int / e2e).
