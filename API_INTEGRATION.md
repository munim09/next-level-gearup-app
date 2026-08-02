# 🔗 GearUp Frontend ↔ Backend Integration Map

Maps every frontend **page / component** to the **server action** it calls and the **backend endpoint** that action hits. Use it to answer "where is this API consumed?" and "which component backs this endpoint?".

Base URL comes from `NEXT_PUBLIC_BACKEND_API_URL`. All server actions live in `app/_actions/*`.

---

## 🔐 Authentication

| Page / Component | Server Action | Endpoint | Method |
|---|---|---|---|
| `app/auth/register/page.tsx` | `register` (`app/_actions/auth.ts`) | `/api/auth/register` | `POST` |
| `app/auth/login/page.tsx` | `login` (`app/_actions/auth.ts`) | `/api/auth/login` | `POST` |
| `app/_components/login-modal.tsx` | `login.bind(null, "modal")` (`app/_actions/auth.ts`) | `/api/auth/login` | `POST` |
| `app/_components/profile-dropdown.tsx` | `logout` (`app/_actions/auth.ts`) | — (clears cookies client-side) | — |
| `app/_actions/session-verify.ts` | `verifySession` | — (decodes JWT locally) | — |
| `service/refreshToken.ts` | `getNewAccessToken` | `/api/auth/refresh-token` | `POST` |
| `proxy.ts` (middleware) | `getNewAccessToken` (via `service/refreshToken.ts`) | `/api/auth/refresh-token` | `POST` |

> `verifySession` is used by every dashboard page + `gear-list.tsx` + `provider-gear-browse.tsx` for role guards.

---

## 🏋️ Gear & Categories (Public)

| Page / Component | Server Action | Endpoint | Notes |
|---|---|---|---|
| `app/page.tsx` | `fetchFeaturedGear` (`gear.ts`) | `GET /api/gear` | Featured section |
| `app/page.tsx` | `fetchCategories` (`gear.ts`) | `GET /api/categories` | "Browse by Category" chips |
| `app/gear/page.tsx` | `fetchCategories` (`gear.ts`) | `GET /api/categories` | Filter sidebar data |
| `app/_components/gear-list.tsx` | `fetchAllGear` (`gear.ts`) | `GET /api/gear` | `search`, `categoryId`, `minPrice`, `maxPrice`, `page`, `limit` |
| `app/gear/[id]/page.tsx` | `fetchGearById` (`gear.ts`) | `GET /api/gear/:id` | Detail page |
| `app/gear/[id]/page.tsx` | `fetchReviews` (`gear.ts`) | `GET /api/reviews/:gearId` | Review list + avg rating |


## 🏪 Providers

| Page / Component | Server Action | Endpoint | Notes |
|---|---|---|---|
| `app/providers/page.tsx` | `fetchAllProviders` (`provider.ts`) | `GET /api/provider` | `page`, `limit` |
| `app/providers/[id]/page.tsx` | `fetchProviderPublicGear` (`provider.ts`) | `GET /api/gear/provider/:providerId` | Public provider gear |
| `app/_components/provider-gear-browse.tsx` | `placeMultiItemRentalOrder` (`rentals.ts`) | `POST /api/rentals` | Multi-item cart checkout |

---

## 🛍️ Customer: Rentals & Payments

| Page / Component | Server Action | Endpoint | Method |
|---|---|---|---|
| `app/_components/rent-button.tsx` | `placeRentalOrder` (`rentals.ts`) | `POST /api/rentals` | `POST` |
| `app/_components/featured-gear.tsx` | `placeRentalOrder` (`rentals.ts`) | `POST /api/rentals` | `POST` |
| `app/_components/gear-list.tsx` | `placeRentalOrder` (`rentals.ts`) | `POST /api/rentals` | `POST` |
| `app/dashboard/customer/page.tsx` | `fetchCustomerRentals` (`dashboard.ts`) | `GET /api/rentals` | `GET` |
| `app/dashboard/customer/page.tsx` | `fetchCustomerPayments` (`dashboard.ts`) | `GET /api/payments` | `GET` |
| `app/_components/customer-orders.tsx` | `cancelRentalOrder` (`dashboard.ts`) | `PATCH /api/rentals/cancel/:id` | `PATCH` |
| `app/dashboard/customer/orders/[id]/pay/page.tsx` | `fetchRentalOrder` (`dashboard.ts`) | `GET /api/rentals/:id` | `GET` |
| `app/_components/pay-button.tsx` | `initiatePayment` (`dashboard.ts`) | `POST /api/payments/create/:orderId` | `POST` |
| `app/payment/success/[orderId]/page.tsx` | `fetchOrderPaymentDetails` (`lib/payment-callback.ts`) | `GET /api/payments/:orderId` | `GET` |
| `app/payment/cancel/[orderId]/page.tsx` | `fetchOrderPaymentDetails` (`lib/payment-callback.ts`) | `GET /api/payments/:orderId` | `GET` |

> The gateway redirects back to `/payment/success/:orderId` or `/payment/cancel/`, which re-fetch order payment status via `GET /api/payments/:orderId`.

---

## 🏗️ Provider Dashboard

| Page / Component | Server Action | Endpoint | Method |
|---|---|---|---|
| `app/dashboard/provider/page.tsx` | `fetchProviderGear` (`provider.ts`) | `GET /api/gear/provider/:providerId` | `GET` |
| `app/dashboard/provider/page.tsx` | `fetchProviderOrders` (`provider.ts`) | `GET /api/provider/orders` | `GET` |
| `app/dashboard/provider/page.tsx` | `fetchCategories` (`gear.ts`) | `GET /api/categories` | `GET` |
| `app/dashboard/provider/orders/page.tsx` | `fetchProviderOrders` (`provider.ts`) | `GET /api/provider/orders` | `GET` |
| `app/_components/provider-orders.tsx` | `updateProviderOrderStatus` (`provider.ts`) | `PATCH /api/provider/orders/:id` | `PATCH` |
| `app/dashboard/provider/gear/new/page.tsx` | `fetchCategories` (`gear.ts`) | `GET /api/categories` | `GET` |
| `app/_components/provider-gear-form.tsx` | `createGear` / `updateGear` (`provider.ts`) | `POST /api/provider/gear` / `PUT /api/provider/gear/:gearId` | `POST`/`PUT` |
| `app/_components/provider-stock-modal.tsx` | `updateGearStock` (`provider.ts`) | `PATCH /api/provider/gear/:gearId` | `PATCH` |
| `app/_components/provider-gear-list.tsx` | `deleteGear` (`provider.ts`) | `DELETE /api/provider/gear/:gearId` | `DELETE` |

---

## 👨‍💼 Admin Dashboard

| Page / Component | Server Action | Endpoint | Method |
|---|---|---|---|
| `app/dashboard/admin/page.tsx` | `fetchAdminUsers` (`admin.ts`) | `GET /api/admin/users` | `GET` |
| `app/dashboard/admin/page.tsx` | `fetchCategories` (`gear.ts`) | `GET /api/categories` | `GET` |
| `app/_components/admin-user-list.tsx` | `updateUserStatus` (`admin.ts`) | `PATCH /api/admin/users/:id` | `PATCH` |
| `app/_components/admin-category-manager.tsx` | `createCategory` (`admin.ts`) | `POST /api/admin/category` | `POST` |

---

## 🔄 Reverse Index (Endpoint → Frontend Usage)

| Endpoint | Method | Frontend |
|---|---|---|
| `/api/auth/register` | `POST` | `app/auth/register/page.tsx` |
| `/api/auth/login` | `POST` | `app/auth/login/page.tsx`, `app/_components/login-modal.tsx` |
| `/api/auth/refresh-token` | `POST` | `service/refreshToken.ts`, `proxy.ts` |
| `/api/gear` | `GET` | `app/page.tsx`, `app/_components/gear-list.tsx` |
| `/api/gear/:id` | `GET` | `app/gear/[id]/page.tsx` |
| `/api/gear/provider/:providerId` | `GET` | `app/providers/[id]/page.tsx`, `app/dashboard/provider/page.tsx` |
| `/api/categories` | `GET` | `app/page.tsx`, `app/gear/page.tsx`, `app/dashboard/provider/*`, `app/dashboard/admin/page.tsx` |
| `/api/reviews/:gearId` | `GET` | `app/gear/[id]/page.tsx` |
| `/api/provider` | `GET` | `app/providers/page.tsx` |
| `/api/rentals` | `POST` | `app/_components/rent-button.tsx`, `featured-gear.tsx`, `gear-list.tsx`, `provider-gear-browse.tsx` |
| `/api/rentals` | `GET` | `app/dashboard/customer/page.tsx` |
| `/api/rentals/:id` | `GET` | `app/dashboard/customer/orders/[id]/pay/page.tsx` |
| `/api/rentals/cancel/:id` | `PATCH` | `app/_components/customer-orders.tsx` |
| `/api/provider/orders` | `GET` | `app/dashboard/provider/page.tsx`, `app/dashboard/provider/orders/page.tsx` |
| `/api/provider/orders/:id` | `PATCH` | `app/_components/provider-orders.tsx` |
| `/api/provider/gear` | `POST` | `app/_components/provider-gear-form.tsx` |
| `/api/provider/gear/:gearId` | `PUT` | `app/_components/provider-gear-form.tsx` |
| `/api/provider/gear/:gearId` | `PATCH` | `app/_components/provider-stock-modal.tsx` |
| `/api/provider/gear/:gearId` | `DELETE` | `app/_components/provider-gear-list.tsx` |
| `/api/payments/create/:orderId` | `POST` | `app/_components/pay-button.tsx` |
| `/api/payments/:orderId` | `GET` | `app/payment/success/[orderId]/page.tsx`, `app/payment/cancel/[orderId]/page.tsx` |
| `/api/payments` | `GET` | `app/dashboard/customer/page.tsx` |
| `/api/admin/users` | `GET` | `app/dashboard/admin/page.tsx` |
| `/api/admin/users/:id` | `PATCH` | `app/_components/admin-user-list.tsx` |
| `/api/admin/category` | `POST` | `app/_components/admin-category-manager.tsx` |

---

## ⚠️ Backend Endpoints Defined but NOT Wired in Frontend

| Endpoint | Method | Notes |
|---|---|---|
| `/api/auth/me` | `GET` | Session is derived from the JWT locally instead |
| `/api/admin/gear` | `GET` | No "view all gear" admin page yet |
| `/api/admin/rentals` | `GET` | No admin order-monitoring page yet |
| `/api/admin/category/:id` | `PUT` / `DELETE` | Manager UI only supports create |
| `/api/payments/confirm/success` | `GET` | Handled by gateway redirect; not called directly |
| `/api/payments/check/:paymentId` | `GET` | Not consumed |
| `/api/reviews/:gearId` | `POST` | Review submission not implemented in UI |

---
