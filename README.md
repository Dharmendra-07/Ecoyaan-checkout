# 🌿 Ecoyaan Checkout Flow

A clean, responsive multi-step checkout flow built with **Next.js**, **Tailwind CSS**, and **React Context API** — inspired by sustainable e-commerce.

---

Live Deshboard Link:- https://ecoyaan-checkout-xi.vercel.app/

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open in browser
http://localhost:3000
```

---

## 📁 Project Structure

```
ecoyaan-checkout/
├── pages/
│   ├── api/
│   │   └── cart.js          # Mock API route (SSR data source)
│   ├── _app.js              # App wrapper with CheckoutProvider
│   ├── _document.js         # Custom document (fonts, meta)
│   ├── index.js             # Step 1 — Cart (SSR via getServerSideProps)
│   ├── shipping.js          # Step 2 — Shipping Address Form
│   ├── payment.js           # Step 3 — Payment & Review
│   └── success.js           # Order Success screen
├── components/
│   └── UI/
│       └── Layout.js        # Shared layout with header & step indicator
├── context/
│   └── CheckoutContext.js   # Global state (cart, address, totals)
├── styles/
│   └── globals.css          # Tailwind base + custom animations
├── tailwind.config.js
├── next.config.js
└── README.md
```

---

## 🧠 Architectural Choices

### Server-Side Rendering
- **`getServerSideProps`** on the Cart page (`/`) fetches cart data from the local mock API (`/api/cart`) on each request.
- This simulates a real-world scenario where cart data is fetched server-side (e.g., from a database or external API) before rendering.
- Cart data is passed as `pageProps.cartData` and picked up by `_app.js` to seed the `CheckoutProvider`.

### State Management — React Context API
- `CheckoutContext` holds all shared state: `cartItems`, `shippingAddress`, pricing, and cart mutations (`updateQuantity`, `removeItem`).
- Chosen over Redux/Zustand for this scope — the app has one context consumer and no deeply nested state.
- State persists across the three-step flow within the same session.

### Form Validation
- Shipping form uses **field-level validation** triggered on `blur` and on submit attempt.
- Errors are only shown after a field is "touched" (interacted with), avoiding premature error messages.
- Validated fields: Full Name (min 3 chars), Email (regex), Phone (10-digit Indian mobile), PIN (6 digits), City, State, Address (min 10 chars).

### UI/UX Design
- **Organic/natural aesthetic** — forest greens, earth tones, Lora serif display font, DM Sans body font.
- Responsive grid layout: single column on mobile, 2/3 + 1/3 sidebar on desktop.
- Sticky order summary sidebar throughout the flow.
- Micro-interactions: product card hover lift, button press effect, animated step indicator, confetti on success.
- Step progress indicator updates visually across all three steps.

---

## 🔌 Mock API

`GET /api/cart` returns:

```json
{
  "cartItems": [
    { "product_id": 101, "product_name": "Bamboo Toothbrush (Pack of 4)", "product_price": 299, "quantity": 2, "image": "..." },
    { "product_id": 102, "product_name": "Reusable Cotton Produce Bags", "product_price": 450, "quantity": 1, "image": "..." }
  ],
  "shipping_fee": 50,
  "discount_applied": 0
}
```

---

## 🛠 Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (Pages Router) |
| Styling | Tailwind CSS 3 |
| State | React Context API |
| SSR | `getServerSideProps` |
| Mock Backend | Next.js API Routes |
| Fonts | Lora + DM Sans (Google Fonts) |

---

## 📦 Deployment

This project is ready to deploy on **Vercel**:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repo to [vercel.com](https://vercel.com) for automatic deployments.

---

## ✅ Features Checklist

- [x] Cart screen with product list, quantity controls, subtotal/total
- [x] SSR cart data via `getServerSideProps` + API route
- [x] Shipping address form with full validation
- [x] Payment method selection (UPI, Card, Net Banking, COD)
- [x] Final order review with address summary
- [x] Simulated payment with loading state
- [x] Order success page with eco-impact summary
- [x] Responsive design (mobile + desktop)
- [x] Step progress indicator
- [x] Context-based state management

---

*Built with 💚 for sustainable e-commerce.*
