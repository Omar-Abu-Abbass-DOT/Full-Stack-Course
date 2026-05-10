<div align="center">

<img src="public/logo.png" alt="OSTA logo" width="180" />

# OSTA — Home Services Marketplace

**A bilingual (Arabic / English), full-stack home-services platform built with Next.js 16, MongoDB Atlas, and JWT authentication.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=000)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=fff)](https://www.mongodb.com/atlas)
[![Mongoose](https://img.shields.io/badge/Mongoose-9-880000)](https://mongoosejs.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-000?logo=jsonwebtokens&logoColor=fff)](https://jwt.io/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Image_CDN-3448C5?logo=cloudinary&logoColor=fff)](https://cloudinary.com/)

</div>

---

## ✨ What is OSTA?

**OSTA** (Arabic for "Master Craftsman") is a marketplace connecting customers in Jordan with trusted home‑service professionals: cleaning, plumbing, electrical, painting, gardening, moving, AC repair, and carpentry.

It is the final, full‑stack project for the **DOT Jordan Full‑Stack Web Development Bootcamp**.

### Visual identity
| Token        | Value                  | Usage                                |
| ------------ | ---------------------- | ------------------------------------ |
| Navy Blue    | `#1e3a5f`              | Primary brand colour, gear, wordmark |
| Orange       | `#f97316`              | Accent, CTAs, the "house" in logo    |
| Black        | `#0d1117`              | Body text                            |
| White        | `#ffffff`              | Background (light theme)             |

---

## 🚀 Quick Start (TL;DR)

```bash
# 1. Install
npm install

# 2. Configure
cp .env.example .env.local      # then edit values

# 3. Seed database (creates admin + categories + demo services)
npm run seed

# 4. Run
npm run dev                     # http://localhost:3000
```

**Demo accounts (after seeding)**

| Role      | Email                       | Password      |
| --------- | --------------------------- | ------------- |
| Admin     | `admin@osta.com`            | `admin123`    |
| Provider  | `sara.provider@osta.com`    | `provider123` |
| Provider  | `khalid.provider@osta.com`  | `provider123` |

---

## 🧱 Tech Stack

| Layer        | Technology                                                           |
| ------------ | -------------------------------------------------------------------- |
| Framework    | **Next.js 16** (App Router, Turbopack, React Server Components)      |
| UI runtime   | **React 19**                                                         |
| Styling      | Vanilla CSS with CSS variables (light/dark themes, RTL/LTR support)  |
| Database     | **MongoDB Atlas** with **Mongoose 9** ODM                            |
| Auth         | **JWT** (`jsonwebtoken`) + bcrypt for password hashing               |
| File uploads | **Cloudinary** (avatars + service images)                            |
| Email        | **Nodemailer** (Gmail SMTP) for booking notifications                |
| Real-time    | **Socket.io** running on a custom Node server attached to Next.js    |
| i18n         | Custom hand‑rolled bilingual EN/AR system (no extra dependency)      |
| Deployment   | **Vercel** (recommended) — zero‑config; uses serverless functions    |

The project intentionally avoids large UI libraries (no Tailwind, no Material UI, no Zustand). Everything is React + plain CSS so the codebase stays small and easy to read for a learning project.

---

## ✅ Core Features

### Customer
* Browse services with **search, category, location, and price‑range filters**
* Pagination on the services listing
* Service detail page with description, price, location, **map embed** (when coordinates exist), provider info, ratings, and reviews
* **Book a service** with date/time + optional notes
* Track all bookings with statuses (pending / accepted / completed / cancelled)
* Leave **star ratings + reviews** after a completed booking
* **Profile page** with avatar upload (Cloudinary)

### Provider
* Same as customer for browsing, plus:
* **My Services** dashboard — list, create, edit, delete services
* Receive bookings; **Accept**, **Decline**, **Mark Completed**
* "Use my current location" button when creating a service (HTML5 Geolocation → coordinates auto‑filled)

### Admin
* Full **Admin Panel** with sidebar navigation
* Dashboard with platform overview (totals + average rating)
* Manage **users** (promote, deactivate, delete)
* Manage **categories** (CRUD)
* Manage **services** (table view, edit, delete)
* Manage **bookings** (table view, edit, delete)

### Cross‑cutting
* **Authentication & authorisation** — Login, Register, JWT in `localStorage`, role‑based protected routes
* **Responsive design** — mobile, tablet, desktop with collapsible sidebar
* **Light + Dark theme** — persisted in localStorage, no flash on load
* **Bilingual EN ⇄ AR** — see [Internationalisation](#-internationalisation) below
* **Real-time notifications** — Socket.io pushes events the moment a booking is created or its status changes; see [Real-time](#-real-time-notifications) below
* **Email notifications** — booking confirmation + status updates (when SMTP configured)
* **Validation** — server‑side checks on every API route
* **Pagination** — uniform helper across services, categories, bookings, reviews, users
* **Search** — full text via case‑insensitive regex on title / description / category

---

## 🌍 Internationalisation

OSTA is **fully bilingual**: every user‑visible string flips between English and Arabic — including the *content* in the database (service titles, descriptions, category names, locations).

### How it works

1. **UI strings** are stored in [`src/lib/translations.js`](src/lib/translations.js) under two dictionaries: `messages.en` and `messages.ar` (one record per key, e.g. `home.hero.title`).
2. **Dynamic content** (DB‑backed) is translated through static maps in the same file:
   * `CATEGORY_TRANSLATIONS_AR` — `Cleaning → تنظيف`, `Plumbing → سباكة`, …
   * `SERVICE_TITLES_AR` — `Deep House Cleaning → تنظيف منزلي عميق`, …
   * `SERVICE_DESCRIPTIONS_AR` — full description maps for the seeded services
   * `loc.<City>` — `Amman → عمّان`, `Zarqa → الزرقاء`, `Irbid → إربد`, `Aqaba → العقبة`
   * `STATUS_TRANSLATIONS_AR` — `pending → قيد الانتظار`, …
   * `ROLE_TRANSLATIONS_AR` — `customer → عميل`, `provider → مزوّد خدمة`, `admin → مشرف`
3. The [`LocaleContext`](src/contexts/LocaleContext.js) exposes helper functions to React components:

```jsx
const {
  t,               // generic UI translator: t("home.hero.title")
  tCategory,       // tCategory(service.category)
  tCatDesc,        // tCatDesc(category.description)
  tServiceTitle,   // tServiceTitle(service.title)
  tServiceDesc,    // tServiceDesc(service.description)
  tStatus,         // tStatus(booking.status)
  tRole,           // tRole(user.role)
  tLocation,       // tLocation(service.location)
  toggleLocale,    // flip EN ⇄ AR
  isRTL,           // boolean — true when locale is AR
} = useLocale();
```

When the user toggles the language:
* `<html dir>` flips to `rtl` / `ltr`
* `<html lang>` flips to `ar` / `en`
* The whole CSS layout uses logical properties (`margin-inline-start`, `padding-inline-end`, …) so it mirrors automatically
* The choice is persisted in `localStorage` under the key `osta-locale`
* A no‑flash bootstrap script in [`src/app/layout.js`](src/app/layout.js) applies the right `dir`/`lang` **before** React hydrates

## 🔔 Real-time Notifications

OSTA pushes events to users **the moment they happen** using **Socket.io** — no polling.

### What gets pushed?

| Event                 | Triggered when                                | Recipient |
| --------------------- | --------------------------------------------- | --------- |
| `booking.created`     | A customer books a service                    | Provider  |
| `booking.accepted`    | A provider accepts a booking                  | Customer  |
| `booking.completed`   | A provider marks a booking as completed       | Customer  |
| `booking.cancelled`   | Either party cancels                          | The other |

The recipient sees:
1. A **toast** popping in the corner with the message,
2. The **bell icon** in the top bar growing an orange badge with the unread count,
3. A new **unread row** in the bell drop-down and on the `/notifications` page.

Notifications are also persisted in MongoDB (collection `notifications`) so they survive a full page reload and the user can revisit them later.

### Architecture

```
Browser (React)                                 Server (Node)
─────────────────                              ──────────────
SocketContext  ←── socket.io-client ───┐       ┌── socket.io  attached to the same
                                       │       │   HTTP server as Next.js
LocalStorage[token]  ──── handshake ───┴───────┴── JWT verified, joins room
                                                   `user:<id>`
                                                       ▲
                                                       │
                                                  emitToUser(id, "notification", …)
                                                  is called from API routes
                                                  (booking POST / PUT)
```

### Files involved

| File                                          | Role                                         |
| --------------------------------------------- | -------------------------------------------- |
| [`server.js`](server.js)                      | Custom Next.js server + attached Socket.io  |
| [`src/lib/socket.js`](src/lib/socket.js)      | Server helper — `getIO()` / `emitToUser()`  |
| [`src/contexts/SocketContext.js`](src/contexts/SocketContext.js) | Client provider — connects, listens, exposes notifications |
| [`src/components/NotificationBell.js`](src/components/NotificationBell.js) | Top-bar bell with unread badge & dropdown |
| [`src/app/notifications/page.js`](src/app/notifications/page.js) | Full notifications page (`/notifications`) |
| [`src/app/api/notifications/route.js`](src/app/api/notifications/route.js) | `GET` history + `PATCH` mark-read API |
| [`src/models/Notification.js`](src/models/Notification.js) | Mongoose model (`user`, `message`, `isRead`) |

### Why a custom `server.js`?

Next.js's default `next dev` / `next start` is serverless-style — there is no long‑lived HTTP server to attach Socket.io to. We boot Next.js manually:

```js
import next from "next";
import { Server as SocketIOServer } from "socket.io";
import { createServer } from "node:http";

const app = next({ dev: process.env.NODE_ENV !== "production" });
await app.prepare();
const httpServer = createServer((req, res) => app.getRequestHandler()(req, res));
const io = new SocketIOServer(httpServer, { path: "/api/socket.io" });
globalThis.__osta_io = io;          // shared with API routes via lib/socket.js
httpServer.listen(3000);
```

Each connection authenticates with the user's JWT (`socket.handshake.auth.token`) and joins a personal room (`user:<id>`). API routes call `emitToUser(id, "notification", payload)` to deliver targeted events.

### ⚠️ Vercel deployment caveat

Vercel's serverless functions **cannot keep WebSocket connections open**. To deploy with Socket.io enabled, choose **one** of:

1. **Render / Railway / Fly.io / DigitalOcean App Platform / a VPS** — they all run `node server.js` happily and keep the WS connection alive.
2. **Vercel for Next.js + a separate WS host** — keep the marketing/static parts on Vercel and run `server.js` on a small worker host that the client points to via an env var.
3. **Disable real-time on Vercel** — running `npm run dev:next` / `npm run start:next` (the `:next` variants) skips the custom server. The app still works completely; the socket simply never connects (handled gracefully — emits become no-ops, the bell shows 🔴 offline).

### Adding a new language

1. Add a new `messages.<lang> = { … }` object in [`translations.js`](src/lib/translations.js) covering every key in `messages.en`.
2. Add a translation map for any DB content you want translated (categories, service titles, etc.).
3. Update `SUPPORTED_LOCALES` at the top of the same file.
4. Update `applyLocale()` in `LocaleContext.js` if your language needs RTL.

---

## 📂 Project Structure

```
home-services-marketplace/
├── public/
│   ├── logo.png            # Full logo (gear + house + "OSTA" wordmark)
│   ├── logo-mark.png       # Square mark only (favicon, sidebar avatar)
│   └── logo.svg            # Vector source
├── scripts/
│   ├── make-logo.ps1       # Re-generate the PNG logos (PowerShell + System.Drawing)
│   └── seed.mjs            # Seed admin, categories, demo providers, demo services
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── api/            # All backend routes (REST under /api/*)
│   │   ├── admin/          # Admin panel (layout + nested pages)
│   │   ├── bookings/       # /bookings (customer + provider + admin views)
│   │   ├── categories/     # Public category catalog
│   │   ├── login/          # /login
│   │   ├── register/       # /register
│   │   ├── profile/        # /profile (protected)
│   │   ├── provider/       # /provider/services + /provider/services/[id]/edit
│   │   ├── services/       # Public services list + /services/[id] detail
│   │   ├── globals.css     # Whole design system (well-commented)
│   │   ├── layout.js       # Root layout (no-flash i18n/theme bootstrap)
│   │   ├── page.js         # Home (server component → fetches latest 6 services + 8 categories)
│   │   ├── error.js        # Global error UI
│   │   ├── loading.js      # Suspense fallback
│   │   └── not-found.js    # 404 page
│   ├── components/
│   │   ├── AppShell.js     # Sidebar + TopBar + main + Footer wrapper
│   │   ├── Sidebar.js      # Vertical role-aware navigation
│   │   ├── TopBar.js       # Sticky top bar with the centered search
│   │   ├── Footer.js       # Multi-column footer
│   │   ├── ServiceCard.js  # Card used on home + services list (i18n-aware)
│   │   ├── ServiceForm.js  # Provider form to create/edit a service
│   │   ├── HomeContent.js  # Hero / how-it-works / categories / latest / CTA
│   │   ├── Logo.js         # <Image> wrapper (mark or full variant)
│   │   ├── ThemeToggle.js  # ☀ / 🌙 button
│   │   ├── LocaleToggle.js # EN / ع button
│   │   ├── ProtectedRoute.js
│   │   ├── StatusBadge.js  # Pending / Accepted / Completed / Cancelled badge
│   │   ├── RatingStars.js  # Display + interactive picker (1-5)
│   │   ├── Pagination.js
│   │   ├── EmptyState.js
│   │   ├── Spinner.js
│   │   └── MapEmbed.js     # Google Maps iframe (no API key required)
│   ├── contexts/
│   │   ├── AuthContext.js     # Auth + JWT token persistence
│   │   ├── LocaleContext.js   # Language state + helpers
│   │   ├── ThemeContext.js    # light/dark
│   │   └── ToastContext.js    # Toast notifications
│   ├── lib/
│   │   ├── apiClient.js       # Browser fetch wrapper (Authorization header, JSON)
│   │   ├── apiHelpers.js      # Server-side helpers: ok/created/fail, pagination, payload
│   │   ├── auth.js            # JWT sign/verify, password hash/compare
│   │   ├── authMiddleware.js  # requireAuth + requireRole guards
│   │   ├── db.js              # Mongoose connect + global cache + model registration
│   │   ├── sendEmail.js       # Nodemailer transporter
│   │   ├── translations.js    # All UI strings + content translation maps
│   │   └── validators.js      # isEmail, isFiniteNumber, escapeRegex, ROLES, …
│   └── models/
│       ├── User.js
│       ├── Category.js
│       ├── Service.js
│       ├── Booking.js
│       ├── Review.js
│       └── Notification.js
├── .env.example
├── next.config.mjs            # devIndicators: false, turbopack root pin, image hosts
└── package.json
```

---

## 🔌 Environment Variables

Copy `.env.example` → `.env.local` and fill the values:

```bash
# MongoDB connection (Atlas SRV string is fine; for restricted DNS see notes below)
MONGODB_URI="mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority"

# JWT secret — long random string (≥ 32 chars recommended)
JWT_SECRET="some-long-random-string"

# Cloudinary (parsed from a CLOUDINARY_URL=cloudinary://<key>:<secret>@<cloud>)
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Gmail SMTP (use a Google App Password, NOT your normal password)
EMAIL_USER="yourgmail@gmail.com"
EMAIL_PASS="your_gmail_app_password"
```

> **Note:** `mongodb+srv://` URIs require DNS that can resolve `_mongodb._tcp.<cluster>` SRV records. If your network blocks SRV lookups (common on locked‑down corporate / sandboxed networks), use a standard `mongodb://host1,host2,host3:27017/?ssl=true&replicaSet=...&authSource=admin` URI with the resolved replica‑set hostnames instead. The codebase honours both.

The seed script will refuse to start if `MONGODB_URI` is missing.

---

## 🛣️ REST API

All routes live under `/api/*`. Auth‑protected routes expect `Authorization: Bearer <token>` (JWT issued by `/api/auth/login`).

### Auth

| Method | Path                | Body                                     | Auth   | Description                          |
| ------ | ------------------- | ---------------------------------------- | ------ | ------------------------------------ |
| POST   | `/api/auth/register`| `{name, email, password, role, phone?}`  | —      | Create a new account                 |
| POST   | `/api/auth/login`   | `{email, password}`                      | —      | Returns `{token, user}`              |
| GET    | `/api/auth/me`      | —                                        | ✅     | Return current user                  |
| PUT    | `/api/auth/me`      | `{name?, phone?, avatar?}`               | ✅     | Update own profile                   |

### Categories

| Method | Path                    | Auth        | Description                |
| ------ | ----------------------- | ----------- | -------------------------- |
| GET    | `/api/categories`       | —           | List + paginate            |
| POST   | `/api/categories`       | admin       | Create category            |
| GET    | `/api/categories/[id]`  | —           | Read category              |
| PUT    | `/api/categories/[id]`  | admin       | Update category            |
| DELETE | `/api/categories/[id]`  | admin       | Delete category            |

### Services

| Method | Path                      | Auth                | Description                                           |
| ------ | ------------------------- | ------------------- | ----------------------------------------------------- |
| GET    | `/api/services`           | —                   | List, supports `search/category/location/minPrice/maxPrice/page/limit` |
| POST   | `/api/services`           | provider            | Create a new service                                  |
| GET    | `/api/services/[id]`      | —                   | Service detail (with provider populated)              |
| PUT    | `/api/services/[id]`      | provider (own) / admin | Update service                                     |
| DELETE | `/api/services/[id]`      | provider (own) / admin | Delete service                                     |

### Bookings

| Method | Path                  | Auth                       | Description                                  |
| ------ | --------------------- | -------------------------- | -------------------------------------------- |
| GET    | `/api/bookings`       | ✅                          | Customer sees own; provider sees received; admin sees all |
| POST   | `/api/bookings`       | customer                    | `{service, date, notes?}`                    |
| GET    | `/api/bookings/[id]`  | involved party / admin       | Single booking with populated refs           |
| PUT    | `/api/bookings/[id]`  | involved party / admin       | Update status (pending/accepted/completed/cancelled) |
| DELETE | `/api/bookings/[id]`  | admin                       | Hard delete                                  |

### Reviews

| Method | Path                 | Auth                          | Description                    |
| ------ | -------------------- | ----------------------------- | ------------------------------ |
| GET    | `/api/reviews`       | —                             | List by `service=<id>`         |
| POST   | `/api/reviews`       | customer (with completed booking)| `{service, rating, comment}` |
| GET    | `/api/reviews/[id]`  | —                             | Single review                  |
| PUT    | `/api/reviews/[id]`  | author                        | Edit own review                |
| DELETE | `/api/reviews/[id]`  | author / admin                | Delete review                  |

### Misc

| Method | Path                   | Auth   | Description                                  |
| ------ | ---------------------- | ------ | -------------------------------------------- |
| POST   | `/api/upload`          | ✅      | Upload a base64 image to Cloudinary          |
| GET    | `/api/admin/users`     | admin  | List + paginate users                        |
| PUT    | `/api/admin/users/[id]`| admin  | Update user (role, isActive, etc.)           |
| DELETE | `/api/admin/users/[id]`| admin  | Delete user                                  |

A complete Postman‑friendly description with sample request bodies is in [`API_DOCUMENTATION.md`](API_DOCUMENTATION.md).

---

## 🎨 UI Highlights

* **Vertical sidebar** that collapses to a slide‑in drawer below 1024 px wide.
* **Centered search bar** in the top bar — pill‑shaped, gradient orange "Search" button, focus ring, navigates to `/services?search=…`.
* **Logo** is a custom navy‑and‑orange gear+house mark, generated as PNG by [`scripts/make-logo.ps1`](scripts/make-logo.ps1) using only built‑in .NET drawing — no external image dependencies.
* **Hero stats strip** with 4 KPI numbers and a 3‑step "How it works".
* **Service cards** with category badge, location pin, price gradient, provider avatar.
* **Map embed** uses the bare Google Maps iframe URL — no API key is needed.
* **Light + Dark themes** — both designed individually, brand colours stay vivid in dark.
* **No‑flash boot** — theme & locale are applied via an inline script *before* hydration to avoid the white-flash → dark-mode jump.
* **Next.js dev N badge is hidden** in dev (`devIndicators: false` in `next.config.mjs`) for a cleaner preview.

---

## 🔐 Auth & Authorisation Flow

1. User registers → password hashed with **bcrypt** → User document saved.
2. User logs in → server compares hash → issues a **JWT** signed with `JWT_SECRET` (1‑week expiry).
3. Browser stores the token in `localStorage` under the key `token` and includes it as `Authorization: Bearer <token>` on every API call (handled centrally by `apiClient.js`).
4. Server‑side middleware (`requireAuth` / `requireRole`) decodes the JWT, looks up the user, and either rejects with 401/403 or attaches the user to the request.
5. On the client, `<ProtectedRoute roles={[…]}>` redirects unauthenticated visitors to `/login?next=<original>`.

---

## 🧰 Useful Scripts

| Script               | What it does                                                                  |
| -------------------- | ----------------------------------------------------------------------------- |
| `npm run dev`        | **Default.** Custom Node server + Socket.io + Next.js in dev mode             |
| `npm run dev:next`   | Plain `next dev` (no real-time; useful when debugging the Next runtime alone) |
| `npm run build`      | Production build (Turbopack)                                                  |
| `npm start`          | **Default.** Production custom server (`NODE_ENV=production node server.js`) |
| `npm run start:next` | Plain `next start` (no Socket.io)                                             |
| `npm run lint`       | Run ESLint                                                                    |
| `npm run seed`       | Idempotent seeding: admin, 8 categories, 2 providers, 8 services              |

The seed script is **safe to run multiple times** — it will skip resources that already exist.

---

## 🧪 Manual Test Checklist

When evaluating the project, the following flows should all work end‑to‑end:

1. **Anonymous browsing** — visit `/`, `/services`, `/categories`, `/services/[id]` without logging in.
2. **Search** — type in the centered top‑bar search → land on `/services?search=…` with results.
3. **Filter** — pick a category and a price range on `/services` → URL updates → results paginate.
4. **Register** as a *Customer* → auto-login → redirected to `/services`.
5. **Book a service** — pick a date in the future → submit → see it on `/bookings` with status *Pending*.
6. **Logout** → log in as `khalid.provider@osta.com / provider123` → see the booking in `/bookings` (provider view) → **Accept** it.
7. **Real-time test** — keep the customer tab open in one browser and the provider tab in another (or same browser, different profile/window). Book a service in the customer tab → the provider's bell instantly grows a "1" badge and a toast appears. Provider clicks **Accept** → the customer's bell does the same in reverse.
8. Switch user back to the customer → after the provider marks it *Completed* → leave a **5‑star review**.
9. Log in as `admin@osta.com / admin123` → visit `/admin` → check stats reflect reality → CRUD a category.
10. Toggle the language to **العربية** → confirm: hero, sidebar, footer, service cards, category names, descriptions, locations, statuses, badges — **everything** is Arabic.
11. Toggle the theme to **Dark** → contrast and brand colours remain readable on every page.
12. Resize to a phone width → sidebar collapses → hamburger opens it → backdrop closes it.

---

## 🚢 Deployment (Vercel)

1. Push the repo to GitHub.
2. Import it into Vercel.
3. Set every variable from `.env.local` in **Vercel → Settings → Environment Variables** (do **not** commit `.env.local`).
4. Vercel autodetects Next.js and deploys. The `/api/*` routes become serverless functions automatically.
5. Whitelist Vercel's egress IPs in MongoDB Atlas → **Network Access** (or allow `0.0.0.0/0` for a quick demo — not recommended in prod).
6. Test the deployed URL with the demo accounts above.

---

## 🩹 Known Caveats / Pre‑existing Behaviour

* The seed script creates the **same** demo password (`provider123`, `admin123`) — change them before deploying publicly.
* `Date.now()` is called inside the render of `services/[id]/page.js` to compute the booking‑form `min` attribute; ESLint flags it as impure but it is harmless for the form's purposes.
* Some context providers initialise their state in a `useEffect`, which the React 19 strict ESLint plugin warns about (`react-hooks/set-state-in-effect`). This is a *style* warning, not a bug — they only run once and are debounced.

---

## 🧑‍💻 Team

DOT Jordan — Full‑Stack Web Development Bootcamp · Final Project · 2026.

---

## 📜 License

This project is built for educational purposes as part of the DOT Jordan bootcamp. You may reuse it for learning, personal projects, or as a starting point — please credit OSTA / DOT Jordan if you do.
