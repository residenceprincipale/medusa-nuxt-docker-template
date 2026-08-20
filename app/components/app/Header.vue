<template>
  <header>
    <nav class="container">
      <NuxtLink to="/" class="logo">{{ $t('nav.home') }}</NuxtLink>
      <div class="nav-links">
        <NuxtLink v-if="features.search" to="/search">{{ $t('nav.search') }}</NuxtLink>
        <NuxtLink v-if="features.blog" to="/blog">{{ $t('nav.blog') }}</NuxtLink>
        <NuxtLink v-if="features.contact" to="/contact">{{ $t('nav.contact') }}</NuxtLink>
        <NuxtLink v-if="features.about" to="/about">{{ $t('nav.about') }}</NuxtLink>
        <NuxtLink to="/cart" class="cart-link">
          {{ $t('nav.cart') }}
          <span v-if="cartStore.itemCount > 0" class="badge">{{ cartStore.itemCount }}</span>
        </NuxtLink>
        <NuxtLink v-if="features.auth && authStore.isLoggedIn" to="/account">{{ $t('nav.account') }}</NuxtLink>
        <NuxtLink v-if="features.auth && !authStore.isLoggedIn" to="/auth/login">{{ $t('nav.login') }}</NuxtLink>
        <UiButton v-if="features.auth && authStore.isLoggedIn" variant="ghost" @click="handleLogout">
          {{ $t('nav.logout') }}
        </UiButton>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
const features = useFeatures()
const cartStore = useCartStore()
const authStore = useAuthStore()

async function handleLogout() {
  await authStore.logout()
  await navigateTo('/')
}
</script>

<style scoped>
header {
  border-bottom: 1px solid var(--border);
  padding: 1rem 0;
  margin-bottom: 2rem;
}
header a {
  text-decoration: none;
}
nav {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
  flex-wrap: wrap;
  font-size: 0.9rem;
}
.logo {
  font-weight: 700;
  letter-spacing: 0.02em;
}
.nav-links {
  display: flex;
  gap: 1.25rem;
  align-items: baseline;
  flex-wrap: wrap;
}
.nav-links a {
  text-decoration: none;
}
.cart-link {
  position: relative;
}
.badge {
  font-size: 0.8rem;
  margin-left: 0.25rem;
}
</style>
