FROM oven/bun:1 AS builder
WORKDIR /app
ARG NUXT_PUBLIC_MEDUSA_BACKEND=http://localhost:9000
ARG NUXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=
ENV NUXT_PUBLIC_MEDUSA_BACKEND=$NUXT_PUBLIC_MEDUSA_BACKEND
ENV NUXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=$NUXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile || bun install
COPY . .
RUN bun run build

FROM oven/bun:1 AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.output ./.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
