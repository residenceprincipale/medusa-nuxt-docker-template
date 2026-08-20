const { loadEnv, defineConfig } = require('@medusajs/framework/utils')

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

const modules = []

if (process.env.STRIPE_API_KEY) {
  modules.push({
    resolve: '@medusajs/payment-stripe',
    id: 'stripe',
    options: {
      apiKey: process.env.STRIPE_API_KEY,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
      capture: true,
    },
  })
}

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    databaseDriverOptions: {
      connection: { ssl: false },
    },
    http: {
      storeCors: process.env.STORE_CORS,
      adminCors: process.env.ADMIN_CORS,
      authCors: process.env.AUTH_CORS,
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
    },
    cookieOptions: {
      secure: false,
    },
  },
  modules: [
    ...modules,
    {
      resolve: './src/modules/wishlist/module',
    },
    {
      resolve: './src/modules/reviews/module',
    },
    {
      resolve: './src/modules/blog/module',
    },
  ],
})
