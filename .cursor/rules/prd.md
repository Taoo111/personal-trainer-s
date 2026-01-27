# Product Requirements Document (PRD)
**Project Name:** Personal Trainer E-commerce Platform


## 1. Executive Summary
Stworzenie dedykowanej platformy e-commerce dla trenera personalnego, umożliwiającej sprzedaż produktów cyfrowych (plany treningowe, e-booki, diety) oraz automatyzację procesu dostarczania treści po zakupie.

## 2. User Personas
* **Administrator (Trener):** Zarządza ofertą, dodaje nowe produkty (PDF), podgląda zamówienia i przychody. Potrzebuje prostego panelu (Payload CMS).
* **Klient:** Osoba chcąca szybko kupić plan/dietę. Oczekuje natychmiastowego dostępu do pliku po płatności, bez zakładania konta (Guest Checkout) bądź istnieje tez druga droga z spersonalizowanym kontem uzytkownika.

## 3. Core Features (MVP)
### 3.1. Storefront (Frontend)
* **Landing Page:** Hero section, bio trenera, sekcja "Dlaczego warto", wyróżnione produkty.
* **Product Page:** Szczegóły planu, cena, przycisk CTA (Call to Action).
* **Checkout:** Integracja ze Stripe (płatność kartą/BLIK).
* **Success Page:** Podziękowanie za zakup i informacja o wysyłce maila.

### 3.2. Backend & CMS (Payload)
* **Products Collection:** Nazwa, Opis, Cena, Plik cyfrowy (zabezpieczony), Zdjęcie okładki.
* **Orders Collection:** Status płatności, Email klienta, Zakupione produkty.
* **Automatyzacja:** Webhook nasłuchujący zdarzenia `checkout.session.completed` ze Stripe.

### 3.3. Authentication & User Accounts (Course Requirement)
* **Hybrid Auth Flow:** Zakup możliwy jako Gość (Guest Checkout). Konto użytkownika jest tworzone niejawnie (implicite) na podstawie adresu email po pierwszym zakupie.
* **Customer Dashboard:** Zalogowany użytkownik ma dostęp do sekcji "Moje zamówienia", gdzie może ponownie pobrać zakupione pliki (zabezpieczenie na wypadek zgubienia maila).
* **Auth Strategy:** Payload CMS Native Auth (kolekcja `users`).

## 4. Technical Architecture
* **Frontend:** Next.js (App Router) + Tailwind CSS + Komponenty v0.
* **Backend/CMS:** Payload CMS (TypeScript).
* **Database:** MongoDB (lub Postgres - zależnie od wyboru adaptera Payload).
* **Payments:** Stripe API.
* **Hosting:** Vercel.

## 5. Success Metrics
* Czas ładowania strony < 2s.
* Poprawne przejście ścieżki: Wybór produktu -> Płatność -> Otrzymanie pliku.