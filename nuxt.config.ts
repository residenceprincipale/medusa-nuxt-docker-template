export default defineNuxtConfig({
  compatibilityDate: '2026-08-20',
  devtools: { enabled: true },
  ssr: true,

  modules: ['@pinia/nuxt', '@nuxtjs/i18n', '@vueuse/nuxt'],

  i18n: {
    restructuredDir: false,
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'fr', name: 'Francais', file: 'fr.json' },
    ],
    defaultLocale: 'en',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_lang',
      redirectOn: 'root',
    },
  },

  runtimeConfig: {
    medusaBackend: process.env.NUXT_SERVER_MEDUSA_BACKEND || 'http://backend:9000',
    public: {
      medusaBackend: process.env.NUXT_PUBLIC_MEDUSA_BACKEND || 'http://localhost:9000',
      medusaPublishableKey: process.env.NUXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '',
      // Admin panel URL. Local default: backend admin at :9000/app.
      // Override per environment (e.g. NUXT_PUBLIC_MEDUSA_ADMIN_URL=https://admin.example.com).
      adminUrl: process.env.NUXT_PUBLIC_MEDUSA_ADMIN_URL || 'http://localhost:9000/app',
    },
  },

  app: {
    head: {
      title: 'Medusa Store',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'A modern e-commerce storefront built with MedusaJS and Nuxt 3' },
        { name: 'theme-color', content: '#1a1a1a' },
        { property: 'og:title', content: 'Medusa Store' },
        { property: 'og:description', content: 'A modern e-commerce storefront built with MedusaJS and Nuxt 3' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },

  css: ['~/assets/main.css'],

  nitro: {
    compressPublicAssets: true,
  },

  experimental: {
    payloadExtraction: true,
  },

  ignore: ['**/node_modules/**', '**/.git/**', '**/.output/**', '**/.nuxt/**', '**/.medusa/**'],

  routeRules: {
    '/about': { prerender: true },
    '/blog/**': { swr: 3600 },
    '/cart': { ssr: false },
    '/checkout': { ssr: false },
  },
})
