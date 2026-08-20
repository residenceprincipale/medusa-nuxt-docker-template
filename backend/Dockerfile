FROM oven/bun:1 AS builder
WORKDIR /app
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile || bun install
COPY . .
RUN bun run build

FROM oven/bun:1 AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.medusa ./.medusa
COPY --from=builder /app/.medusa/server/public/admin ./public/admin
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/medusa-config.js ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/src ./src
EXPOSE 9000
CMD ["sh", "-c", "bun run db:migrate && bun run start"]
