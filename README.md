

# CRYOSTASIS

**A cinematic e-commerce experience for a fictional cryonics technology brand.**

Dark. Monochrome. Deliberately slow.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-111111?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-111111?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%2B%20Firestore-111111?style=flat-square&logo=firebase&logoColor=white)](https://firebase.google.com)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-111111?style=flat-square&logo=stripe&logoColor=white)](https://stripe.com)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-111111?style=flat-square&logo=three.js&logoColor=white)](https://threejs.org)

</div>

---

## About

CryoStasis is a fully functional online store built around a fictional cryonics
company — product catalog, authentication, cart, and real payments — wrapped in
a deliberately crafted visual language: hand-rolled ASCII rendering on canvas,
film grain, a cursor spotlight, and a monochrome Swiss-grid layout.

The project was developed as a **graduation thesis** — a study in how far a
small, type-safe Next.js codebase can be pushed when the interface is treated
as a first-class engineering problem, not an afterthought.

Everything in the catalog is data-driven. No hardcoded products, no mock UI —
every price, name, and availability flag lives in Firestore and is rendered
from there.

## Highlights

**ASCII hero, rendered by hand.** The landing page renders two photographs as
animated ASCII art in real time: each frame, the image is drawn to an
offscreen canvas, luminance is sampled per grid cell, and a character from a
curated charset (`@#S%?*+;:,.`) is chosen to match the brightness. Entry and
exit are choreographed — when the user proceeds to the product, both canvases
play a synchronized outro before the route transition fires.

**Choreographed transitions.** Navigation is synchronous with animation. The
hero registers an exit handler through context; the header awaits both canvas
outros before pushing the next route. Nothing pops, nothing jolts.

**Bilingual by design.** Full i18n through a React context — interface copy
lives in translation files, not scattered through components.

**Design system as code.** Colors, typefaces, and a shared exponential easing
curve are defined once in `src/constants/tokens.ts` and mirrored in the
Tailwind config — one source of truth for the entire visual layer.

**Deliberate texture.** Film-grain overlay, Swiss grid, ambient background
blobs, spring-physics cursor spotlight. The page feels printed, not rendered.

**Real payments.** Stripe PaymentIntents created server-side through a Route
Handler, confirmed client-side with Stripe Elements.

## Tech Stack

| Layer      | Choice                                              |
| ---------- | --------------------------------------------------- |
| Framework  | Next.js 16 (App Router) + React 19                  |
| Language   | TypeScript, strict                                  |
| Styling    | Tailwind CSS + design tokens                        |
| Motion     | Framer Motion, shared `EASE_EXPO` curve             |
| 3D / Canvas| Three.js, @react-three/fiber, @react-three/drei     |
| Backend    | Firebase Auth (email + Google), Cloud Firestore     |
| Payments   | Stripe (server-side PaymentIntents)                 |
| Icons      | lucide-react, Heroicons                             |

## Architecture

### Data model

```
users/{uid}      → profile, provider, timestamps       (owner-only access)
products/{sku}   → catalog: name, subtitle, price, availability  (public read)
orders/{orderId} → items, subtotal, currency, status   (immutable from client)
```

### Security model

All access control is enforced by [`firestore.rules`](firestore.rules), not by
the UI:

- Catalog is **read-only from the client** — products are managed via Admin SDK
  or console, never from the browser.
- A user can read and write **only their own** `users/{uid}` document.
- Orders can be created by authenticated users for themselves, and are
  **immutable** afterwards (`update, delete: if false`).
- Everything else is denied by a default-deny rule.

## Getting Started

**Prerequisites:** Node.js 20+, a Firebase project, and a Stripe account.

1. Clone and install:

   ```bash
   git clone https://github.com/saintnojr/cryostasis.git
   cd cryostasis
   npm install
   ```

2. Configure environment (`.env.local`):

   ```bash
   # Firebase client config
   NEXT_PUBLIC_FIREBASE_API_KEY=
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
   NEXT_PUBLIC_FIREBASE_APP_ID=

   # Stripe
   STRIPE_SECRET_KEY=
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
   ```

3. Seed the catalog and run:

   ```bash
   npm run seed    # populate Firestore with products
   npm run dev     # http://localhost:4028
   ```

4. Deploy the security rules:

   ```bash
   firebase deploy --only firestore:rules
   ```

## Scripts

| Command         | Description                              |
| --------------- | ---------------------------------------- |
| `npm run dev`   | Start the dev server on port 4028        |
| `npm run build` | Production build                          |
| `npm run start` | Serve the production build                |
| `npm run seed`  | Seed Firestore with the product catalog   |
| `npm run lint`  | ESLint                                    |

## Project Structure

```
src/
├── app/                 # App Router pages
│   ├── api/create-payment-intent/  # server-side Stripe intents
│   ├── auth/  account/  cart/  checkout/
│   ├── home/            # landing + ASCII hero
│   └── product/         # product detail page
├── components/          # Header, Footer, CheckoutForm, GrainOverlay, ui/
├── constants/           # design tokens, navigation
├── context/             # Auth, cart, language, hero-exit orchestration
├── hooks/  lib/  types/  styles/
scripts/seed-firestore.mjs
firestore.rules          # the entire security model
```

## Design Language

Monochrome by constraint. One background (`#0A0A0A`), one foreground
(`#F0F0F0`), hairline borders, IBM Plex Mono for data, generous letter-spacing,
small uppercase metadata — coordinates, standards, version — placed like
credits on a film poster. Motion uses a single exponential ease everywhere:
`[0.23, 1, 0.32, 1]`.

## Roadmap

- [ ] Stripe webhook to confirm payments and move orders out of `pending`
- [ ] Server-side cart amount validation before PaymentIntent creation
- [ ] Order history in the account section
- [ ] CI with type-check, lint, and rules deployment

## Acknowledgments

Built as a graduation project with Next.js, Firebase, and Stripe — and an
unhealthy amount of canvas code. Interfaces should be engineered, not decorated.

<div align="center">
<sub>43°14′N 76°56′E · ALMATY · EST. 2026</sub>
</div>
