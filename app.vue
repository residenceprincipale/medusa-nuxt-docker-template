<template>
  <div id="app">
    <header>
      <nav class="container">
        <NuxtLink to="/" class="logo">{{ $t('nav.home') }}</NuxtLink>
        <div class="nav-links">
          <NuxtLink v-if="features.search" to="/search">{{ $t('nav.search') }}</NuxtLink>
          <NuxtLink v-if="features.blog" to="/blog">{{ $t('nav.blog') }}</NuxtLink>
          <NuxtLink v-if="features.about" to="/about">{{ $t('nav.about') }}</NuxtLink>
          <NuxtLink v-if="features.contact" to="/contact">{{ $t('nav.contact') }}</NuxtLink>
          <NuxtLink v-if="features.auth && authStore.isLoggedIn" to="/account">{{ $t('nav.account') }}</NuxtLink>
          <NuxtLink v-if="features.auth && !authStore.isLoggedIn" to="/auth/login">{{ $t('nav.login') }}</NuxtLink>
          <button v-if="features.auth && authStore.isLoggedIn" class="btn-link" @click="handleLogout">{{ $t('nav.logout') }}</button>
          <NuxtLink to="/cart" class="cart-link">
            {{ $t('nav.cart') }}
            <span v-if="cartStore.itemCount > 0" class="badge">{{ cartStore.itemCount }}</span>
          </NuxtLink>
        </div>
      </nav>
    </header>

    <main class="container">
      <NuxtPage />
    </main>

    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const features = useFeatures()
const cartStore = useCartStore()
const authStore = useAuthStore()

if (features.auth) {
  authStore.init()
}

useHead({
  titleTemplate: (title) => title ? `${title} | Medusa Store` : 'Medusa Store',
})

useSeoMeta({
  ogSiteName: 'Medusa Store',
  twitterCard: 'summary_large_image',
})

async function handleLogout() {
  await authStore.logout()
  await navigateTo('/')
}
</script>
