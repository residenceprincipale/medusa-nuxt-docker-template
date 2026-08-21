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

const fileModule = process.env.S3_BUCKET
  ? {
      resolve: '@medusajs/file-s3',
      options: {
        bucket: process.env.S3_BUCKET,
        region: process.env.S3_REGION,
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        ...(process.env.S3_ENDPOINT ? { endpoint: process.env.S3_ENDPOINT } : {}),
        ...(process.env.S3_PREFIX ? { prefix: process.env.S3_PREFIX } : {}),
      },
    }
  : undefined

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
  admin: {
    // maxUploadFileSize: 10 * 1024 * 1024, // 10 MB (or Infinity)
    storefrontUrl: process.env.STOREFRONT_URL || 'http://localhost:3000',
  },
  modules: [
    ...modules,
    ...(fileModule ? [fileModule] : []),
    {
      resolve: '@medusajs/medusa/notification',
      options: {
        providers: [
          {
            resolve: './src/modules/email/module',
            id: 'smtp',
            options: {
              channels: ['email'],
              host: process.env.SMTP_HOST,
              port: process.env.SMTP_PORT,
              secure: process.env.SMTP_SECURE === 'true',
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
              from: process.env.SMTP_FROM,
            },
          },
        ],
      },
    },
  ],
})
