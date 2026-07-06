<p align="center">
  <img src="public/images/luffy-gear5.jpg" alt="Haki-Drop" width="100%" />
</p>

<h1 align="center">🗾 Haki-Drop</h1>

<p align="center">
  <strong>One Piece — Premium Streetwear & Collectibles</strong>
  <br />
  An immersive e‑commerce experience powered by Next.js
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js" alt="Next.js 15" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=flat&logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Razorpay- payments-02042B?style=flat&logo=razorpay" alt="Razorpay" />
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=flat&logo=docker" alt="Docker" />
  <img src="https://img.shields.io/badge/Deploy-Render-46E3B7?style=flat&logo=render" alt="Render" />
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Screenshots](#-screenshots)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Overview](#-api-overview)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [Roadmap](#-roadmap)
- [License](#-license)

---

## 🌊 Overview

**Haki-Drop** is a full‑featured e‑commerce platform themed around the world of *One Piece*. It combines a stunning **Gear 5 reveal landing page** (canvas‑based animation) with a complete shopping experience — product catalog, cart, checkout, user auth, admin dashboard, and more.

> Built for fans, by a fan. Every pixel pays homage to Eiichiro Oda's masterpiece.

---

## 📸 Screenshots

| Page | Preview |
|------|---------|
| **Hero** — Gear 5 reveal animation | ![Hero](public/images/luffy-gear5.jpg) |
| **Product Catalog** — Grid with filters | *(coming soon)* |
| **Cart Drawer** — Slide‑out with quantity controls | *(coming soon)* |
| **Dashboard** — Admin analytics & orders | *(coming soon)* |

---

## ✨ Features

### 🎨 Frontend
- **Gear 5 Reveal Hero** — Canvas‑based animation with glow effects, mask transitions, and the iconic drums of liberation audio
- **Product Catalog** — Responsive grid with search, autocomplete, and category filtering
- **Cart Drawer** — Slide‑out panel with real‑time quantity updates, product links, and persistent state
- **Wishlist** — Save products for later with toggle heart button
- **Smooth Scroll** — Custom scrollbar and smooth navigation
- **Audio Player** — Background "Drums of Liberation" playback
- **Character Timeline** — Interactive Luffy transformation journey (Gear 1 → Gear 5)
- **Fully Responsive** — Mobile‑first design, works on all screen sizes

### 🔐 Authentication
- Register / Login with JWT
- OTP email verification
- Forgot / Reset password flow
- Session management (view/revoke active sessions)
- OAuth-ready (Google, Apple stubs included)

### 🛒 E‑Commerce
- **Postgres‑backed Cart** — Survives server restarts, keyed by session or user ID
- **Razorpay Payments** — Full intent/verify flow with COD fallback
- **Order Management** — Create, list, view orders with status tracking
- **Product Catalog** — 50+ products with variants, images, and collections

### 📊 Admin Dashboard
- Sales & revenue analytics
- Order management (view, update status)
- Product CRUD with image upload
- Inventory tracking
- Customer management
- Coupon & discount system
- Marketing tools
- Shipping zone configuration
- Review moderation

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 15](https://nextjs.org) (App Router, Turbopack) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com) |
| **Database** | [PostgreSQL](https://www.postgresql.org) on [Neon](https://neon.tech) |
| **ORM / Client** | [Supabase JS](https://supabase.com/docs/reference/javascript) |
| **Auth** | JWT (custom store) + NextAuth.js |
| **Payments** | [Razorpay](https://razorpay.com) |
| **State** | React Context (cart, wishlist, auth) + Redux (dashboard) |
| **Email** | [Resend](https://resend.com) + Nodemailer (SMTP fallback) |
| **Deployment** | [Render](https://render.com) via Docker |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Next.js App                       │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │  Pages/  │  │  API     │  │  Components/      │  │
│  │  Routes  │  │  Routes  │  │  Context/Hooks    │  │
│  └──────────┘  └──────────┘  └───────────────────┘  │
│        │             │                │              │
│        ▼             ▼                ▼              │
│  ┌──────────────────────────────────────────────┐   │
│  │              lib/ (store layer)               │   │
│  │  cart-store.ts  auth-store.ts  order-store.ts │   │
│  └──────────────────────────────────────────────┘   │
│        │                                            │
│        ▼                                            │
│  ┌──────────────────────────────────────────────┐   │
│  │            supabase.ts (Postgres)             │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                        │
                        ▼
              ┌──────────────────┐
              │   PostgreSQL     │
              │   (Neon)         │
              └──────────────────┘
```

### Key Design Decisions
- **Self‑contained API** — All routes are self‑contained with zero external service dependencies (no Shopify, no external backend)
- **Persistent Cart** — Migrated from in‑memory Map to Postgres; items survive container restarts
- **Data Flow** — Pages → API Routes → Store Layer (lib/) → Supabase → Postgres

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon free tier works great)
- Razorpay account (test mode)
- Resend or SMTP credentials (for emails)

### Installation

```bash
# Clone the repository
git clone https://github.com/luccy93/Haki-Drop.git
cd Haki-Drop

# Install dependencies
npm install

# Copy environment variables
cp .env.production .env.local
```

### Database Setup

Run the SQL migration files **in order** using your Neon SQL editor:

```
 1. supabase-schema.sql        → Creates tables & schemas
 2. seed-products.sql          → 50+ products with variants
 3. seed-images.sql            → Product image URLs
 4. migration-001-cart-items.sql → Cart persistence table
```

### Start Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🌐 Live Site

**https://haki-drop.onrender.com**

---

## 🔐 Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (Neon) |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | (optional) Stripe publishable key |
| `RESEND_API_KEY` | Resend API key for emails |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | SMTP fallback credentials |
| `NEXT_PUBLIC_SITE_URL` | Public deployment URL |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |

---

## 📡 API Overview

All routes are under `src/app/api/`.

| Endpoint | Description |
|----------|-------------|
| **Products** | |
| `GET /api/products` | List all products (cached) |
| `GET /api/products/[handle]` | Single product by handle |
| **Cart** (Postgres‑backed) | |
| `GET /api/cart` | Get cart items |
| `POST /api/cart/add` | Add item to cart |
| `PUT /api/cart/item/[id]` | Update quantity |
| `DELETE /api/cart/item/[id]` | Remove item |
| `DELETE /api/cart/clear` | Clear cart |
| `POST /api/cart/merge` | Merge guest → user cart |
| **Auth** | |
| `POST /api/auth/register` | Register with email + password |
| `POST /api/auth/login` | Login, returns JWT pair |
| `POST /api/auth/logout` | Logout, revoke refresh token |
| `POST /api/auth/refresh` | Refresh access token |
| `POST /api/auth/verify-otp` | Verify OTP email |
| `POST /api/auth/forgot-password` | Send reset email |
| `POST /api/auth/reset-password` | Reset password with token |
| `GET /api/auth/sessions` | List active sessions |
| **Orders** | |
| `POST /api/orders` | Create order |
| `GET /api/orders` | List user orders |
| `GET /api/orders/[id]` | Order details |
| `POST /api/orders/payment-intent` | Razorpay intent |
| `POST /api/orders/verify-razorpay` | Verify payment |
| `POST /api/orders/mock-payment` | Mock payment (dev) |
| `POST /api/orders/place-cod` | Place COD order |
| **Analytics** | |
| `GET /api/analytics/dashboard` | Dashboard metrics |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/                   # API routes (products, cart, auth, orders)
│   ├── auth/                  # Auth pages (login, signup, forgot-password, etc.)
│   ├── cart/                  # Cart page
│   ├── checkout/              # Checkout & success pages
│   ├── collections/           # Collection pages
│   ├── dashboard/             # Admin dashboard (10+ sections)
│   ├── products/              # Product catalog & detail pages
│   ├── globals.css            # Global styles + Tailwind
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Landing page (Gear 5 hero)
├── components/
│   ├── auth/                  # OTP input, password strength, toast
│   ├── CartDrawer.tsx         # Slide-out cart
│   ├── Header.tsx             # Site header + nav
│   ├── HeroCanvas.tsx         # Gear 5 canvas animation
│   └── ...                    # 20+ components
├── context/
│   ├── CartContext.tsx         # Cart state management
│   └── WishlistContext.tsx    # Wishlist state
├── hooks/
│   └── useCheckout.ts         # Checkout flow hook
├── lib/
│   ├── cart-store.ts          # Cart persistence layer (Postgres)
│   ├── auth-store.ts          # Auth persistence layer
│   ├── order-store.ts         # Order persistence layer
│   ├── supabase.ts            # Supabase client
│   └── email.ts               # Email service (Resend/SMTP)
└── store/
    ├── redux/                 # Redux store (dashboard state)
    └── useAuthStore.ts        # Zustand auth store
```

---

## 🚢 Deployment

### Docker (Recommended)

```bash
# Build image
docker build -t haki-drop .

# Run with env file
docker run -p 3000:3000 --env-file .env.production haki-drop
```

### Render (Free Tier)

1. Push to GitHub: `https://github.com/luccy93/Haki-Drop`
2. On Render: **New + Blueprint** → connect your repository
3. Set environment variables in the Render dashboard
4. Deploy — Render auto‑detects the `Dockerfile`

> The app uses `output: "standalone"` for optimized Docker builds.

---

## 🧭 Roadmap

- [x] Gear 5 reveal landing page
- [x] Product catalog with 50+ products
- [x] Postgres‑backed persistent cart
- [x] JWT auth with OTP verification
- [x] Razorpay payment integration
- [x] Admin dashboard
- [ ] Unit & integration tests
- [ ] Mobile app (React Native)
- [ ] Multi‑language support
- [ ] AI product recommendations
- [ ] Live chat support

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <sub>Built with ❤️ for the One Piece community · <strong>Haki-Drop</strong></sub>
  <br />
  <sub>"The One Piece is real!" — Edward Newgate</sub>
</p>
