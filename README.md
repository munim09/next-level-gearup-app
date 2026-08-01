# 🏋️ GearUp — Frontend

> A modern **Next.js** frontend for a sports & outdoor equipment **rental platform**.
> Customers browse gear and place rental orders, providers manage inventory & orders,
> and admins oversee users & categories — all backed by a REST API with **Stripe + SSLCommerz** payments.

## ✨ Features

### 👤 Customer
- Browse gear with **search**, **category filter**, and **price filter**
- Rent **multiple gear items from a single provider in one order** (cart-style checkout)
- View rental history, payment history, and pay for orders

### 🏪 Provider
- Role-protected dashboard with gear inventory & stock management
- Add / edit / delete gear with full CRUD
- View & update status of incoming rental orders

### 🛡️ Admin
- Role-protected dashboard with platform statistics
- User management — **activate / suspend** users
- Category management — **create categories**

### 💳 Payments
- **Stripe** + **SSLCommerz** (no COD) with success / cancel redirect handling

## 🧱 Tech Stack

| Layer      | Tech |
|------------|------|
| Framework  | Next.js (App Router, React) |
| Styling    | Tailwind CSS v4, shadcn/ui |
| Language   | TypeScript |
| Auth       | JWT (access + refresh), role-based route protection |
| Notifications | sonner |
| Lint       | ESLint 9 (flat config) |

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- A running backend API (see `API_BACKEND.md`)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command             | Action                     |
|---------------------|----------------------------|
| `npm run dev`       | Start dev server           |
| `npm run build`     | Production build           |
| `npm start`         | Start production server    |
| `npm run lint`      | Lint (ESLint)              |
| `npx tsc --noEmit`  | Type check                 |

## 🔐 Environment Variables

| Variable                        | Description                     |
|---------------------------------|---------------------------------|
| `NEXT_PUBLIC_BACKEND_API_URL`   | Base URL of the backend API     |
| `APP_URL`                       | Deployed frontend URL           |
| `JWT_ACCESS_SECRET`             | Secret used to verify access tokens |
| `JWT_REFRESH_SECRET`            | Secret used to verify refresh tokens |

## 🗺️ Route ↔ Backend API Map

> `NEXT_PUBLIC_BACKEND_API_URL` is the base for all endpoints.

### 🌐 Public

| Frontend Route            | Backend API                          | Notes                                   |
|---------------------------|--------------------------------------|-----------------------------------------|
| `/`                       | `GET /api/gear?limit=4`              | Featured gear                          |
| `/`                       | `GET /api/categories`                | Nav / filters                          |
| `/gear`                   | `GET /api/gear`                      | Listing with search, filters & pagination |
| `/gear`                   | `GET /api/categories`                | Filter options                         |
| `/gear/[id]`              | `GET /api/gear/:id`                  | Gear details                           |
| `/gear/[id]`              | `GET /api/reviews/:gearId`           | Reviews                                |
| `/providers`              | `GET /api/provider`                  | Provider list (paginated)              |
| `/providers/[id]`         | `GET /api/gear/provider/:providerId` | Provider gear list                     |
| `/providers/[id]`         | `POST /api/rentals`                  | Multi-item rental order                |

### 🔐 Auth

| Frontend Route            | Backend API          | Notes             |
|---------------------------|----------------------|-------------------|
| `/auth/login`             | `POST /api/auth/login`    | Login (JWT) |
| `/auth/register`          | `POST /api/auth/register` | Register      |

### 👤 Customer

| Frontend Route                                  | Backend API                              | Notes                |
|-------------------------------------------------|------------------------------------------|----------------------|
| `/dashboard/customer`                           | `GET /api/rentals`                       | Rental history       |
| `/dashboard/customer`                           | `GET /api/payments`                      | Payment history      |
| `/dashboard/customer/orders/[id]/pay`           | `GET /api/rentals/:id`                   | Order details        |
| `/dashboard/customer/orders/[id]/pay`           | `POST /api/payments/create/:orderId`     | Initiate payment     |
| `/dashboard/customer` (cancel)                  | `PATCH /api/rentals/cancel/:id`          | Cancel rental        |

### 🏪 Provider

| Frontend Route                     | Backend API                                  | Notes                       |
|------------------------------------|----------------------------------------------|-----------------------------|
| `/dashboard/provider`              | `GET /api/gear/provider/:providerId`         | Provider inventory          |
| `/dashboard/provider`              | `GET /api/provider/orders`                   | Incoming orders             |
| `/dashboard/provider`              | `GET /api/categories`                        | For gear form               |
| `/dashboard/provider/gear/new`     | `POST /api/provider/gear`                    | Add gear                    |
| `/dashboard/provider/gear/new`     | `GET /api/categories`                        | Category options            |
| `/dashboard/provider/orders`       | `GET /api/provider/orders`                   | Order list                  |
| `/dashboard/provider/orders`       | `PATCH /api/provider/orders/:id`             | Update order status         |
| `/dashboard/provider` (actions)    | `PUT /api/provider/gear/:gearId`             | Update gear                 |
| `/dashboard/provider` (actions)    | `PATCH /api/provider/gear/:gearId`           | Update stock                |
| `/dashboard/provider` (actions)    | `DELETE /api/provider/gear/:gearId`          | Delete gear                 |

### 🛡️ Admin

| Frontend Route          | Backend API                   | Notes               |
|-------------------------|-------------------------------|---------------------|
| `/dashboard/admin`      | `GET /api/admin/users`        | All users           |
| `/dashboard/admin`      | `PATCH /api/admin/users/:id`  | Activate / suspend  |
| `/dashboard/admin`      | `GET /api/categories`         | Category list       |
| `/dashboard/admin`      | `POST /api/admin/category`    | Create category     |

### 💳 Payment Redirects

| Frontend Route                     | Backend API                       | Notes                |
|------------------------------------|-----------------------------------|----------------------|
| `/payment/success/[orderId]`       | `GET /api/payments/:orderId`      | Payment success page |
| `/payment/cancel/[orderId]`        | `GET /api/payments/:orderId`      | Payment cancel page  |

## 🗂️ Folder Architecture

```
assignment-frontend/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (providers, toaster)
│   ├── page.tsx                  # Home page (featured gear, categories)
│   ├── loading.tsx               # Global loading state
│   ├── not-found.tsx             # 404 page
│   ├── (.)auth/
│   │   └── login/page.tsx        # Intercepting login route (modal)
│   ├── auth/
│   │   ├── login/page.tsx        # Login page
│   │   └── register/page.tsx     # Register page
│   ├── gear/
│   │   ├── page.tsx              # Gear listing + filters
│   │   └── [id]/page.tsx         # Gear details + reviews
│   ├── providers/
│   │   ├── page.tsx              # Provider list
│   │   └── [id]/page.tsx         # Provider gear + multi-item rent
│   ├── payment/
│   │   ├── success/[orderId]/page.tsx
│   │   └── cancel/[orderId]/page.tsx
│   ├── dashboard/
│   │   ├── customer/
│   │   │   ├── page.tsx          # Customer dashboard
│   │   │   └── orders/[id]/pay/page.tsx
│   │   ├── provider/
│   │   │   ├── page.tsx          # Provider dashboard
│   │   │   ├── gear/new/page.tsx # Add gear form
│   │   │   └── orders/page.tsx   # Incoming orders
│   │   └── admin/
│   │       └── page.tsx          # Admin dashboard (users + categories)
│   ├── _actions/                 # Server actions (API calls)
│   │   ├── auth.ts               # login / register
│   │   ├── gear.ts               # gear, reviews, categories
│   │   ├── provider.ts           # providers, provider gear & orders
│   │   ├── rentals.ts            # place orders (single & multi-item)
│   │   ├── dashboard.ts          # customer rentals / payments
│   │   ├── admin.ts              # admin users & categories
│   │   └── session-verify.ts     # JWT session verification
│   └── _components/              # Client components
│       ├── navbar.tsx / footer.tsx
│       ├── gear-list.tsx / gear-filter.tsx / gear-search.tsx
│       ├── featured-gear.tsx / rent-button.tsx
│       ├── provider-gear-browse.tsx        # Multi-item cart
│       ├── provider-gear-list.tsx / provider-gear-form.tsx
│       ├── provider-orders.tsx / provider-stock-modal.tsx
│       ├── customer-orders.tsx / pay-button.tsx / payment-result.tsx
│       ├── admin-user-list.tsx / admin-category-manager.tsx
│       ├── login-modal.tsx / profile-dropdown.tsx
├── components/ui/               # shadcn/ui components
├── lib/                         # Types, helpers, payment-callback
│   ├── types.ts                 # Shared TypeScript interfaces
│   └── payment-callback.ts
├── service/refreshToken.ts      # Access token refresh logic
├── utils/                       # JWT utils, status badge helpers
├── proxy.ts                     # Middleware — auth & role-based route protection
├── next.config.ts
├── API_BACKEND.md               # Backend API documentation
└── package.json
```

## 🛡️ Role-Based Access

Route protection is handled in `proxy.ts` (middleware):

| Route                 | Allowed Roles       |
|-----------------------|---------------------|
| `/dashboard/customer` | `CUSTOMER`          |
| `/dashboard/provider` | `PROVIDER`          |
| `/dashboard/admin`    | `ADMIN`             |
| `/auth/login`, `/auth/register` | public (redirects logged-in users) |
| `/`, `/gear`, `/gear/*`, `/providers`, `/payment/*` | public |

Unauthenticated users visiting protected routes are redirected to `/auth/login`.
Users with the wrong role are redirected to `/not-found`.

## 📄 Documentation

- `API_BACKEND.md` — complete backend API reference & business rules
- `2-GearUp-Frontend.md` — frontend assignment specification
- `frontend_note.md` — implementation notes & credentials
