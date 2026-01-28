# Diagram UI – moduł logowania i rejestracji

<architecture_analysis>

## 1. Komponenty wymienione w PRD i istniejące w projekcie

**Strony (Next.js App Router):**

- Strona główna (`/`) – `page.tsx` w `(frontend)`
- Logowanie (`/login`) – `login/page.tsx`
- Rejestracja (`/register`) – `register/page.tsx`
- Panel klienta (`/dashboard`) – `dashboard/page.tsx`
- Szczegóły produktu (`/products/[slug]`) – `products/[slug]/page.tsx`
- Sukces checkout (`/checkout/success`) – `checkout/success/page.tsx`

**Layout:**

- `RootLayout` – `layout.tsx` (metadata, html/body, wspólne style)

**Komponenty współdzielone:**

- `Header` – nawigacja, logo, linki (Produkty, O mnie, Opinie), stan auth, przyciski Zaloguj / Dołącz / Panel / Wyloguj
- `Footer` – logo, linki (Polityka, Regulamin, Kontakt), ikony social
- `LogoutButton` – używany na Dashboard (wylogowanie)

**Komponenty specyficzne dla stron:**

- Strona główna: `HeroSection`, `ProductsSection`, `AboutSection`, `TestimonialsSection`
- Produkty: `ProductCard`, `BuyButton`
- Strona produktu: `ProductImage`, `ProductInfo`, `RichTextContent`, `BuyButton`
- Dashboard: `OrderCard`, lista zamówień, przyciski Pobierz

**Moduł autentykacji (strony + komponenty):**

- Strona Logowania: formularz (email, hasło), walidacja, wywołanie `/api/users/login`, przekierowanie do Dashboard
- Strona Rejestracji: formularz (email, hasło, potwierdzenie hasła), walidacja (min 8 znaków, zgodność haseł), wywołanie `/api/users` (POST), automatyczne logowanie, przekierowanie do Dashboard
- Header: sprawdzenie stanu auth przez `/api/users/me`, wyświetlenie Zaloguj/Dołącz lub Panel/Wyloguj

## 2. Główne strony i odpowiadające im komponenty

| Strona        | Ścieżka             | Komponenty strony                                               | Współdzielone                       |
| ------------- | ------------------- | --------------------------------------------------------------- | ----------------------------------- |
| Strona główna | `/`                 | HeroSection, ProductsSection, AboutSection, TestimonialsSection | Header, Footer                      |
| Logowanie     | `/login`            | Formularz logowania (email, hasło)                              | (bez Header/Footer – własny layout) |
| Rejestracja   | `/register`         | Formularz rejestracji (email, hasło, potwierdzenie)             | (bez Header/Footer)                 |
| Dashboard     | `/dashboard`        | Lista zamówień, OrderCard, LogoutButton                         | Header (własny), Footer             |
| Produkt       | `/products/[slug]`  | ProductImage, ProductInfo, BuyButton                            | Header, Footer                      |
| Sukces        | `/checkout/success` | Komunikat podziękowania                                         | (zależnie od implementacji)         |

## 3. Przepływ danych między komponentami

- **Layout → dzieci:** przekazuje tylko `children`; metadata w RootLayout.
- **Header:** pobiera stan użytkownika z `GET /api/users/me` (useEffect), wyświetla linki auth; wylogowanie przez `POST /api/users/logout`.
- **Strona logowania:** formularz → `POST /api/users/login` (email, password) → cookie `payload-token` → przekierowanie na `/dashboard`.
- **Strona rejestracji:** formularz → walidacja (hasło ≥ 8 znaków, hasła zgodne) → `POST /api/users` → `POST /api/users/login` → cookie → przekierowanie na `/dashboard`.
- **Dashboard:** odczyt cookie, `payload.auth()` po stronie serwera (lub odpowiednik), pobranie zamówień przez Payload Local API; niezalogowany → redirect na `/login`.
- **BuyButton:** `createCheckoutSession` (productId, opcjonalnie customerEmail) → Stripe Checkout URL → przekierowanie.

## 4. Krótki opis funkcjonalności komponentów

- **RootLayout:** Ustawia metadata, lang="pl", importuje style globalne, renderuje `children`.
- **Header:** Nawigacja, logo TrainerPro, linki sekcji, sprawdzenie auth (`/api/users/me`), przyciski Zaloguj/Dołącz lub Panel/Wyloguj, menu mobilne.
- **Footer:** Logo, linki (Polityka, Regulamin, Kontakt), ikony social.
- **Strona logowania:** Formularz email + hasło, walidacja, POST do API, obsługa błędów, przekierowanie po sukcesie.
- **Strona rejestracji:** Formularz email + hasło + potwierdzenie, walidacja (8 znaków, zgodność), POST rejestracji, automatyczne logowanie, przekierowanie.
- **LogoutButton:** POST `/api/users/logout`, refresh, przekierowanie.
- **Dashboard:** Weryfikacja sesji (cookies), lista zamówień paid, OrderCard z przyciskiem Pobierz.
- **BuyButton:** Inicjacja sesji Stripe Checkout, obsługa zalogowanego użytkownika (email).

</architecture_analysis>

---

<mermaid_diagram>

```mermaid
flowchart TD
    subgraph Layout["Warstwa Layout"]
        RootLayout["RootLayout"]
        RootLayout --> Metadata["Metadata SEO"]
        RootLayout --> GlobalStyles["Style globalne"]
        RootLayout --> Children["Children"]
    end

    subgraph StronyPubliczne["Strony publiczne"]
        StronaGlowna["Strona główna"]
        StronaProduktu["Strona produktu"]
        SukcesCheckout["Sukces checkout"]
    end

    subgraph ModulAutentykacji["Moduł autentykacji"]
        StronaLogowania["Strona logowania"]
        StronaRejestracji["Strona rejestracji"]
        FormularzLogowania["Formularz logowania"]
        FormularzRejestracji["Formularz rejestracji"]
        WalidacjaLogowania["Walidacja email i hasło"]
        WalidacjaRejestracji["Walidacja hasło i potwierdzenie"]
        StronaLogowania --> FormularzLogowania
        FormularzLogowania --> WalidacjaLogowania
        StronaRejestracji --> FormularzRejestracji
        FormularzRejestracji --> WalidacjaRejestracji
    end

    subgraph StronyChronione["Strony chronione"]
        Dashboard["Panel klienta Dashboard"]
        SprawdzenieSesji["Sprawdzenie sesji"]
        Dashboard --> SprawdzenieSesji
    end

    subgraph KomponentyWspoldzielone["Komponenty współdzielone"]
        Header["Header"]
        Footer["Footer"]
        Header --> StanAuth["Stan użytkownika"]
        StanAuth --> PrzyciskLoguj["Link Zaloguj"]
        StanAuth --> PrzyciskRejestracja["Link Dołącz"]
        StanAuth --> PrzyciskPanel["Link Panel"]
        StanAuth --> PrzyciskWyloguj["Przycisk Wyloguj"]
        LogoutButton["LogoutButton"]
    end

    subgraph API["Warstwa API i stan"]
        APIUsersMe["GET api/users/me"]
        APILogin["POST api/users/login"]
        APIRegister["POST api/users"]
        APILogout["POST api/users/logout"]
    end

    subgraph PrzeplywDanych["Przepływ danych"]
        WalidacjaLogowania -->|"dane poprawne"| APILogin
        APILogin -->|"cookie payload-token"| PrzekierowanieDashboard["Przekierowanie do Dashboard"]
        WalidacjaRejestracji -->|"dane poprawne"| APIRegister
        APIRegister -->|"sukces"| APILogin
        APIRegister -->|"sukces"| PrzekierowanieDashboard
        Header -.->|"sprawdzenie auth"| APIUsersMe
        PrzyciskWyloguj --> APILogout
        APILogout -->|"usunięcie sesji"| PrzekierowanieGlowna["Przekierowanie na stronę główną"]
        SprawdzenieSesji -->|"brak tokena"| PrzekierowanieLogin["Przekierowanie na Login"]
    end

    Children --> StronaGlowna
    Children --> StronaLogowania
    Children --> StronaRejestracji
    Children --> Dashboard
    Children --> StronaProduktu
    Children --> SukcesCheckout

    StronaGlowna --> Header
    StronaGlowna --> Footer
    StronaProduktu --> Header
    StronaProduktu --> Footer
    Dashboard --> Header
    Dashboard --> Footer
    Dashboard --> LogoutButton

    classDef layoutClass fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef authClass fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef protectedClass fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
    classDef sharedClass fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef apiClass fill:#fce4ec,stroke:#c2185b,stroke-width:2px

    class RootLayout,Metadata,GlobalStyles,Children layoutClass
    class StronaLogowania,StronaRejestracji,FormularzLogowania,FormularzRejestracji,WalidacjaLogowania,WalidacjaRejestracji authClass
    class Dashboard,SprawdzenieSesji protectedClass
    class Header,Footer,LogoutButton,StanAuth sharedClass
    class APIUsersMe,APILogin,APIRegister,APILogout apiClass
```

</mermaid_diagram>

---

## Uwagi do diagramu

- **RootLayout** obejmuje metadata i style; nie zawiera Header/Footer – te są dodawane w poszczególnych stronach.
- **Moduł autentykacji** obejmuje strony logowania i rejestracji oraz ich formularze i walidację.
- **Header** jest wspólny dla strony głównej, produktu i dashboardu; stan auth pochodzi z `GET /api/users/me`.
- **Strony chronione** (np. Dashboard) zależą od sprawdzenia sesji; przy braku tokena następuje przekierowanie na login.
- Stylami wyróżniono: layout (niebieski), autentykację (pomarańczowy), strony chronione (zielony), komponenty współdzielone (fioletowy), API (różowy).
