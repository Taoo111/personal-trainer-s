# Product Requirements Document (PRD)

**Project Name:** Personal Trainer E-commerce Platform

## 1. Executive Summary

Stworzenie dedykowanej platformy e-commerce dla trenera personalnego, umożliwiającej sprzedaż produktów cyfrowych (plany treningowe, e-booki, diety) oraz automatyzację procesu dostarczania treści po zakupie.

## 2. User Personas

- **Administrator (Trener):** Zarządza ofertą, dodaje nowe produkty (PDF), podgląda zamówienia i przychody. Potrzebuje prostego panelu (Payload CMS).
- **Klient:** Osoba chcąca szybko kupić plan/dietę. Oczekuje natychmiastowego dostępu do pliku po płatności, bez zakładania konta (Guest Checkout) bądź istnieje też druga droga z spersonalizowanym kontem użytkownika.

---

## 3. User Stories

### US-001: Przeglądanie produktów

- **Tytuł:** Przeglądanie oferty produktów
- **Opis:** Jako klient chcę przeglądać dostępne produkty cyfrowe, aby wybrać odpowiedni plan treningowy lub dietę.
- **Kryteria akceptacji:**
  - Strona główna wyświetla listę dostępnych produktów z miniaturką, tytułem i ceną.
  - Kliknięcie w produkt przenosi na stronę szczegółów produktu.
  - Strona produktu wyświetla pełny opis, cenę i przycisk "Kup teraz".
  - Produkty ładują się w czasie < 2 sekundy.
  - Przeglądanie produktów NIE wymaga logowania.

### US-002: Zakup produktu (Guest Checkout)

- **Tytuł:** Zakup bez rejestracji
- **Opis:** Jako klient chcę móc kupić produkt bez zakładania konta, aby szybko otrzymać plik.
- **Kryteria akceptacji:**
  - Użytkownik może kliknąć "Kup teraz" bez logowania.
  - Użytkownik zostaje przekierowany do Stripe Checkout.
  - Po udanej płatności użytkownik widzi stronę podziękowania (Success Page).
  - Plik produktu jest wysyłany na podany email (lub dostępny do pobrania na Success Page).
  - Zamówienie jest zapisywane w systemie ze statusem "paid".
  - W przypadku błędu płatności użytkownik widzi komunikat o błędzie.

### US-003: Rejestracja użytkownika

- **Tytuł:** Rejestracja konta
- **Opis:** Jako klient chcę móc założyć konto, aby mieć dostęp do historii zakupów i ponownego pobierania plików.
- **Kryteria akceptacji:**
  - Rejestracja odbywa się na dedykowanej stronie `/register`.
  - Formularz wymaga: adres email, hasło, potwierdzenie hasła.
  - Hasło musi mieć minimum 8 znaków.
  - System sprawdza czy email nie jest już zarejestrowany.
  - Po rejestracji użytkownik jest automatycznie zalogowany.
  - Wyświetlane są odpowiednie komunikaty o błędach walidacji.
  - Nie korzystamy z zewnętrznych serwisów logowania (Google, GitHub, etc.).

### US-004: Logowanie użytkownika

- **Tytuł:** Logowanie do systemu
- **Opis:** Jako zarejestrowany klient chcę móc zalogować się do systemu, aby uzyskać dostęp do moich zakupów.
- **Kryteria akceptacji:**
  - Logowanie odbywa się na dedykowanej stronie `/login`.
  - Formularz wymaga: adres email, hasło.
  - Po poprawnym logowaniu użytkownik jest przekierowany do Dashboard.
  - W przypadku błędnych danych wyświetlany jest komunikat o błędzie.
  - Przycisk logowania jest widoczny w nagłówku (prawy górny róg).
  - Sesja użytkownika jest utrzymywana przez cookies (Payload Auth).

### US-005: Wylogowanie użytkownika

- **Tytuł:** Wylogowanie z systemu
- **Opis:** Jako zalogowany użytkownik chcę móc się wylogować, aby zakończyć sesję.
- **Kryteria akceptacji:**
  - Przycisk wylogowania jest widoczny w nagłówku dla zalogowanych użytkowników.
  - Po wylogowaniu użytkownik jest przekierowany na stronę główną.
  - Sesja jest prawidłowo usuwana (cookie usunięty).
  - Próba dostępu do Dashboard po wylogowaniu przekierowuje na stronę logowania.

### US-006: Odzyskiwanie hasła

- **Tytuł:** Reset hasła
- **Opis:** Jako użytkownik chcę móc zresetować zapomniane hasło, aby odzyskać dostęp do konta.
- **Kryteria akceptacji:**
  - Na stronie logowania widoczny jest link "Zapomniałeś hasła?".
  - Strona `/forgot-password` pozwala wprowadzić adres email.
  - System wysyła email z linkiem do resetu hasła (token ważny 1 godzinę).
  - Strona `/reset-password?token=xxx` pozwala ustawić nowe hasło.
  - Nowe hasło musi spełniać wymagania bezpieczeństwa (min. 8 znaków).
  - Po zresetowaniu hasła użytkownik może się zalogować nowym hasłem.

### US-007: Panel klienta (Dashboard)

- **Tytuł:** Historia zamówień i pobieranie plików
- **Opis:** Jako zalogowany klient chcę mieć dostęp do moich zakupów, aby ponownie pobrać pliki.
- **Kryteria akceptacji:**
  - Dashboard jest dostępny pod `/dashboard` tylko dla zalogowanych użytkowników.
  - Wyświetlana jest lista zakupionych produktów z datą zakupu.
  - Przy każdym produkcie widoczny jest przycisk "Pobierz".
  - Kliknięcie "Pobierz" umożliwia pobranie pliku produktu.
  - Jeśli brak zakupów, wyświetlany jest odpowiedni komunikat.
  - Niezalogowani użytkownicy są przekierowywani na `/login`.

### US-008: Zarządzanie produktami (Admin)

- **Tytuł:** Dodawanie i edycja produktów
- **Opis:** Jako administrator chcę zarządzać produktami w panelu CMS, aby aktualizować ofertę.
- **Kryteria akceptacji:**
  - Admin Panel dostępny pod `/admin` (Payload CMS).
  - Możliwość dodania produktu: tytuł, opis (RichText), cena, plik PDF/ZIP, zdjęcie okładki.
  - Możliwość edycji istniejącego produktu.
  - Możliwość usunięcia produktu.
  - Slug produktu generowany automatycznie z tytułu.
  - Pliki produktowe są zabezpieczone (niedostępne publicznie bez autoryzacji).

### US-009: Zarządzanie zamówieniami (Admin)

- **Tytuł:** Podgląd zamówień
- **Opis:** Jako administrator chcę widzieć listę zamówień, aby monitorować sprzedaż.
- **Kryteria akceptacji:**
  - Lista zamówień widoczna w Admin Panel.
  - Każde zamówienie zawiera: ID, status, email klienta, produkty, kwotę, datę.
  - Możliwość filtrowania po statusie (pending, paid, failed).
  - Możliwość wyszukiwania po email klienta.
  - Zamówienia są tylko do odczytu (nie można edytować).

### US-010: Automatyczna realizacja zamówienia

- **Tytuł:** Webhook Stripe
- **Opis:** Jako system chcę automatycznie realizować zamówienia po płatności, aby klient natychmiast otrzymał produkt.
- **Kryteria akceptacji:**
  - Webhook nasłuchuje zdarzenia `checkout.session.completed` ze Stripe.
  - Po otrzymaniu zdarzenia status zamówienia zmienia się na "paid".
  - Jeśli użytkownik z danym email nie istnieje, tworzone jest konto (implicit registration).
  - Zamówienie jest przypisywane do użytkownika (jeśli istnieje lub nowo utworzony).
  - Webhook zwraca status 200 w ciągu 30 sekund.
  - Błędy są logowane do monitoringu.

---

## 4. Core Features (MVP)

### 4.1. Storefront (Frontend)

- **Landing Page:** Hero section, bio trenera, sekcja "Dlaczego warto", wyróżnione produkty.
- **Product Page:** Szczegóły planu, cena, opis RichText, przycisk CTA (Call to Action).
- **Checkout:** Integracja ze Stripe (płatność kartą/BLIK).
- **Success Page:** Podziękowanie za zakup i informacja o wysyłce maila.

### 4.2. Backend & CMS (Payload)

- **Products Collection:** Nazwa, Opis, Cena, Plik cyfrowy (zabezpieczony), Zdjęcie okładki.
- **Orders Collection:** Status płatności, Email klienta, Zakupione produkty.
- **Automatyzacja:** Webhook nasłuchujący zdarzenia `checkout.session.completed` ze Stripe.

### 4.3. Authentication & User Accounts

- **Hybrid Auth Flow:** Zakup możliwy jako Gość (Guest Checkout). Konto użytkownika jest tworzone niejawnie (implicit) na podstawie adresu email po pierwszym zakupie.
- **Customer Dashboard:** Zalogowany użytkownik ma dostęp do sekcji "Moje zamówienia", gdzie może ponownie pobrać zakupione pliki.
- **Password Recovery:** Możliwość resetowania hasła przez email.
- **Auth Strategy:** Payload CMS Native Auth (kolekcja `users`).

---

## 5. Technical Architecture

- **Frontend:** Next.js (App Router) + Tailwind CSS + Komponenty v0/shadcn.
- **Backend/CMS:** Payload CMS (TypeScript).
- **Database:** PostgreSQL.
- **Payments:** Stripe API (Checkout Sessions).
- **Hosting:** Vercel.
- **Email:** Resend / Nodemailer (dla reset hasła i potwierdzenia zakupu).

---

## 6. Wymagania niefunkcjonalne (NFR)

### 6.1. Wydajność

- Czas ładowania strony (LCP) < 2 sekundy.
- Time to Interactive (TTI) < 3 sekundy.
- Statyczne generowanie stron produktów (SSG) gdzie możliwe.

### 6.2. Bezpieczeństwo

- Hasła hashowane (bcrypt przez Payload Auth).
- Tokeny resetowania hasła ważne maksymalnie 1 godzinę.
- Pliki produktowe zabezpieczone access control (tylko kupujący/admin).
- HTTPS wymagane dla wszystkich połączeń.
- Weryfikacja podpisu webhook Stripe.

### 6.3. Dostępność

- Aplikacja responsywna (mobile-first).
- Kontrast kolorów zgodny z WCAG AA.
- Obsługa nawigacji klawiaturą.

### 6.4. Skalowalność

- Architektura pozwalająca na dodanie nowych produktów bez zmian w kodzie.
- Payload CMS jako headless CMS z REST/GraphQL API.

---

## 7. Success Metrics

- Czas ładowania strony < 2s (mierzone Lighthouse).
- Poprawne przejście ścieżki: Wybór produktu → Płatność → Otrzymanie pliku.
- Wskaźnik konwersji checkout > 50% (rozpoczętych vs ukończonych).
- Czas odpowiedzi API < 500ms.

---

## 8. Out of Scope (poza MVP)

- Integracja z zewnętrznymi serwisami auth (Google, GitHub).
- Kody rabatowe / kupony.
- Subskrypcje (płatności cykliczne).
- Wielojęzyczność.
- Program afiliacyjny.
- Aplikacja mobilna.
