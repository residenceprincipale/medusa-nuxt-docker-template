# Medusa Store

A modern, production-ready e-commerce storefront built with **Medusa v2** (headless commerce backend) and **Nuxt 4** (Vue 3 SSR storefront), packaged as a single Docker Compose stack with Postgres and Redis.

> Everything runs in containers via `docker compose`. The whole stack — backend, storefront, database, and cache — comes up with one command.

---

## Why this project is useful

- **Headless & composable** — Medusa v2 handles catalog, cart, orders, and auth; the Nuxt storefront is fully customizable and ships with SSR.
- **Zero local toolchain** — Bun, Node, and all build steps live inside Docker. You only need Docker installed.
- **Feature toggles** — turn store sections (blog, reviews, wishlist, Stripe, i18n, etc.) on/off from a single config file without deleting code.
- **Batteries included** — seedable demo catalog, admin dashboard, multi-region pricing, and a ready-to-extend module layout (`wishlist`, `reviews`, `blog`).
- **Docker-native networking** — server-side fetches use the internal `backend:9000` hostname while the browser uses `localhost:9000`, so it "just works" behind one Compose file.

---

## Features

| Area            | Status | Notes                                              |
| --------------- | ------ | -------------------------------------------------- |
| Auth / account  | ✅     | Customer registration, login, order history        |
| Product search  | ✅     | Live search page                                   |
| Categories      | ✅     | Category browsing                                  |
| Promotions      | ✅     | Medusa promotions engine                           |
| Newsletter      | ✅     | Signup flow                                        |
| About / Contact | ✅     | Static content pages                               |
| i18n            | ⚙️     | Scaffolded (en/fr), toggle in `config/features.ts` |
| Stripe          | ⚙️     | Auto-enabled when `STRIPE_API_KEY` is set          |
| Wishlist        | ⚙️     | Custom module, toggle in `config/features.ts`      |
| Reviews         | ⚙️     | Custom module, toggle in `config/features.ts`      |
| Blog            | ⚙️     | Custom module, toggle in `config/features.ts`      |
| Order tracking  | ⚙️     | Toggle in `config/features.ts`                     |

---

## Tech stack

- **Backend:** Medusa v2 (`@medusajs/medusa` 2.19.0), Node 20+, Bun runtime
- **Storefront:** Nuxt 4.5 / Vue 3.5, Pinia, `@nuxtjs/i18n`, `@medusajs/js-sdk`
- **Infra:** Postgres 16, Redis 7, Docker Compose, Bun base images

---

## Getting started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (Docker Compose v2)

### 1. Configure environment

Copy the example env file and adjust secrets:

```bash
cp .env.example .env
```

At minimum, set strong values for `JWT_SECRET` and `COOKIE_SECRET`. For Stripe payments, fill in `STRIPE_API_KEY` and `STRIPE_WEBHOOK_SECRET` (leave empty to skip). For file storage, leave the `S3_*` vars empty to use local `/static` (persisted by the `medusa_static` volume) or fill them in to store uploads in S3.

### 2. Start the stack

```bash
docker compose up -d
```

This builds the backend and storefront images, runs database migrations automatically, and starts all services.

| Service     | URL                       |
| ----------- | ------------------------- |
| Storefront  | http://localhost:3000     |
| Backend API | http://localhost:9000     |
| Admin UI    | http://localhost:9000/app |

### 3. Development mode (hot reload)

Two setups, pick one. Both hot-reload storefront edits on http://localhost:3000.

**A. Everything in Docker (recommended).** Mounts the source and runs `bun run dev` _inside_ a container — no local Bun needed:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

`*.vue`, `composables/`, `stores/` changes hot-reload with no rebuild. Stop with `docker compose -f docker-compose.yml -f docker-compose.dev.yml down`.

**B. Local storefront + Docker backend.** Run only the backend (and Postgres/Redis) in Docker, and `bun run dev` on your machine. Best when you want your editor/debugger on the host. Requires [Bun](https://bun.sh) installed locally.

```bash
# Backend + deps in Docker, exposed at localhost:9000
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d backend 

# Storefront on the host (server + browser both hit localhost:9000)
NUXT_SERVER_MEDUSA_BACKEND=http://localhost:9000 \
NUXT_PUBLIC_MEDUSA_BACKEND=http://localhost:9000 \
NUXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=$NUXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY \
bun install && bun run dev
```

> **Gotcha — same host, both URLs are `localhost:9000`.** In the all-Docker setup the SSR server uses the internal `backend:9000` hostname and only the browser uses `localhost:9000`. When the storefront runs on your host there is no `backend` hostname, so `NUXT_SERVER_MEDUSA_BACKEND` must also point at `localhost:9000` or SSR fetches fail.

### 4. Seed demo data (optional)

```bash
docker compose exec backend bun run db:seed
```

### 5. Create an admin user

```bash
docker compose exec backend bun run user --email admin@mail.com --password supersecret
```

### 6. Connect to a deployed / remote backend

Point the storefront at an already-running Medusa backend (e.g. Render, Railway, your own VPS) instead of the local Docker one. You only run the storefront — no Postgres/Redis/backend containers needed.

Set these in `.env` (or pass inline) to the **remote** backend's values:

```bash
# Remote Medusa backend base URL (no trailing slash) — browser-facing
NUXT_PUBLIC_MEDUSA_BACKEND=https://your-medusa.example.com

# The publishable key from THAT backend — not the local one.
# Get it from the remote backend's admin UI or `medusa` CLI on the deployed project.
NUXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Then run only the storefront:

```bash
# Production image, remote backend
docker compose up -d storefront

# …or dev mode with hot reload (override uses remote URL for both browser + SSR)
NUXT_PUBLIC_MEDUSA_BACKEND=$NUXT_PUBLIC_MEDUSA_BACKEND \
NUXT_SERVER_MEDUSA_BACKEND=$NUXT_PUBLIC_MEDUSA_BACKEND \
NUXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=$NUXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY \
bun run dev
```

> **CORS:** the remote backend must allow your storefront origin. In that backend's env, set `STORE_CORS` to the storefront URL (e.g. `http://localhost:3000` locally, or your deployed storefront domain). Without it, browser requests are blocked.
>
> **Publishable key mismatch** is the usual failure: each Medusa project mints its own key. The `pk_…` in this repo's `.env` is the _local_ backend's — using it against a remote backend returns 401/empty data.

---

## Common commands

```bash
# Rebuild after changing storefront (Nuxt) code
docker compose build storefront && docker compose up -d storefront

# Rebuild after changing backend (src/) code
docker compose build backend && docker compose up -d backend

# Quick-test a single backend file without a full rebuild
docker compose cp backend/src/some-file.ts backend:/app/src/some-file.ts

# Tail logs
docker compose logs -f backend
docker compose logs -f storefront

# Stop everything
docker compose down
```

> **Note:** In production mode the storefront is a built image with no source mount, so editing `*.vue`, `composables/`, or `stores/` has no effect until you rebuild it. For live editing, use the [dev override](#3-development-mode-hot-reload) above. Server-only `NUXT_SERVER_MEDUSA_BACKEND` can be overridden at runtime via Compose `environment` without a rebuild.

---

## Project structure

```
.
├── docker-compose.yml      # postgres + redis + backend + storefront
├── Dockerfile              # Nuxt storefront image
├── nuxt.config.ts          # storefront config (i18n, runtime config, route rules)
├── config/
│   └── features.ts         # feature flags for store sections
├── pages/                  # Nuxt routes (home, products, cart, checkout, …)
├── components/             # UI components (e.g. ProductCard)
├── composables/            # useMedusa() API client
├── stores/                 # Pinia cart store
└── backend/
    ├── Dockerfile          # Medusa backend image
    ├── medusa-config.js    # backend modules & CORS
    └── src/
        ├── seed.ts         # demo catalog seed
        ├── modules/        # custom: wishlist, reviews, blog
        └── api/            # custom store API routes
```

---

## Configuration

### Feature flags

Store sections are toggled in [`config/features.ts`](config/features.ts):

```ts
export const features = {
  blog: false,
  reviews: false,
  wishlist: false,
  i18n: false,
  stripe: false,
  // …
} as const
```

### Backend modules

Custom modules and Stripe are wired in [`backend/medusa-config.js`](backend/medusa-config.js). Stripe is auto-registered when `STRIPE_API_KEY` is present.

#### File storage (S3, optional)

By default Medusa uses its local file provider: uploads are written to `/app/static` inside the backend container and served from `/static`, persisted across recreates by the `medusa_static` volume.

To use S3 instead (or any S3-compatible store like MinIO/R2), set these in `.env` and rebuild the backend:

```bash
S3_BUCKET=my-bucket
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
S3_ENDPOINT=https://s3.us-east-1.amazonaws.com   # optional, for S3-compatible stores
S3_PREFIX=media                                   # optional object-key prefix
```

```bash
docker compose build backend && docker compose up -d backend
```

When `S3_BUCKET` is set, Medusa swaps in `@medusajs/file-s3` and serves image URLs directly from S3, so the storefront and admin need no `/static` mount. Leave all `S3_*` vars empty to keep the local provider.

---

## Getting help

- **Medusa docs:** https://docs.medusajs.com
- **Nuxt docs:** https://nuxt.com/docs
- **Project guidance:** see [`AGENTS.md`](AGENTS.md) for maintainer/debugging notes (pricing units, rebuild gotchas, seeding rules).
- **Issues:** open a GitHub issue in this repository.

---

## Contributing

Contributions are welcome! Please:

1. Fork the repository and create a feature branch.
2. Follow the existing code style and keep feature flags in `config/features.ts`.
3. For behavioral changes to the backend, add/adjust modules under `backend/src/modules`.
4. Submit a pull request describing your change.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guidelines.

---

## Maintainers

This template is maintained by the repository owner. See the GitHub contributors page for the full list.

## License

Licensed under the terms in the [LICENSE](LICENSE) file.
