# 🏋️ GearUp — Frontend

> A modern **Next.js** frontend for a sports & outdoor equipment **rental platform**.
> Customers browse gear and place rental orders, providers manage inventory & orders,
> and admins oversee users & categories — all backed by a REST API with **SSLCommerz** payments.

## 📖 Backend
- Backend API link: **https://github.com/munim09/next-level-gearup**

## ✨ Features

### 👤 Customer
- Browse gear with **search**, **category filter**, and **price filter**
- Rent **multiple gear items from a single provider in one order** (cart-style checkout)
- View rental history, payment history, and pay for orders

### 🏪 Provider
- Role-protected dashboard with gear inventory & stock management
- Add / edit / delete gear
- View & update status of incoming rental orders

### 🛡️ Admin
- Role-protected dashboard
- User management — **activate / suspend** users
- Category management — **create categories**

### 💳 Payments
- **SSLCommerz** with success / cancel redirect handling

## 🧱 Tech Stack

| Layer      | Tech |
|------------|------|
| Framework  | Next.js (App Router, React) |
| Styling    | Tailwind CSS, shadcn/ui |
| Language   | TypeScript |
| Auth       | JWT (access + refresh), role-based route protection |
| Notifications | sonner |

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
| `/payment/cancel/`        		 | 									 | Payment cancel page  |

## 🗂️ Folder Architecture

```
assignment-frontend/
├── app/
│   ├── (.)auth/                # Intercepting login modal route
│   ├── auth/                   # Login & register pages
│   ├── gear/                   # Gear listing & details
│   ├── providers/              # Provider list & provider gear
│   ├── payment/                # Payment success / cancel pages
│   ├── dashboard/
│   │   ├── customer/           # Customer dashboard & order payment
│   │   ├── provider/           # Provider dashboard, gear & orders
│   │   └── admin/              # Admin dashboard (users & categories)
│   ├── _actions/               # Server actions (API calls)
│   └── _components/            # Client components
├── components/
│   └── ui/                     # shadcn/ui components
├── lib/                        # Types, helpers, payment callback
├── service/                    # Token refresh logic
├── utils/                      # JWT & status badge helpers
└── app/ (root files)           # layout, page, loading, not-found, proxy
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
