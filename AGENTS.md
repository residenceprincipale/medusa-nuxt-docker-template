# AGENTS.md

Medusa v2 + Nuxt 4 storefront monorepo, run via `docker compose`. Backend: Medusa `:9000`, storefront: Nuxt `:3000`, plus postgres + redis. Package manager: **bun**.

## Commands

- Bring up everything: `docker compose up -d` (backend auto-runs `db:migrate` then `start`).
- Backend migrate: `docker compose exec backend bun run db:migrate`
- Backend seed: `docker compose exec backend bun run db:seed` (runs `medusa exec src/seed.ts`)
- **Storefront changes** take effect only after rebuild: `docker compose build storefront && docker compose up -d storefront`
- **Backend `src/` changes** likewise need `docker compose build backend && docker compose up -d backend`, OR (quick test) `docker cp` the edited file into the running container then `exec`.
- Dev mode (hot reload) for storefront: `bun run dev`. Dev mode for backend: `docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d backend `.

## Seeding products (`backend/src/seed.ts`)

- Seed default export signature is `async function seedDb({ container })`, NOT a bare container.
- `container.resolve("product")` + raw `productModule.createProducts` **ignores variant `prices`**. Use `createProductsWorkflow` from `@medusajs/medusa/core-flows` to set prices.
- `createProductCategories(...)` returns a **single object**, not an array — don't destructure it as `[cat]`.
- For a product to be **purchasable**, each variant needs `status: "active"` and at least one price entry keyed by `region_id` (plus `status: "active"` on the product).
- Seed only creates store/regions/channels/categories/products; it does not import images, so products render with a "No image" placeholder (backend `/static` image 404 is known/unfixed).

## Layout

- `pages/` — Nuxt routes (home, `products/[handle]`, `cart`, `collections`, `search`, auth, `about`, `contact`, `newsletter`, `blog`).
- `components/` — UI (e.g. `ProductCard.vue`).
- `composables/useMedusa.ts` — API client + server/public URL split.
- `stores/cart.ts` — pinia cart (localStorage `cart_id`).
- `backend/src/` — Medusa modules + `seed.ts`.
- `docker-compose.yml` — services + env wiring. `Dockerfile` (storefront) and `backend/Dockerfile`.

## Verify with Chrome DevTools

After a rebuild: load `http://localhost:3000`, confirm home lists seeded products at correct major-unit prices, open a product, add to cart (cart line + total should match unit price × qty), and check the console for 400/404 errors.
