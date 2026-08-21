<template>
  <div id="app">
    <AppHeader />

    <main class="container">
      <NuxtPage />
    </main>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()

authStore.init()

useHead({
  titleTemplate: (title) => (title ? `${title} | Medusa Store` : 'Medusa Store'),
})

useSeoMeta({
  ogSiteName: 'Medusa Store',
  twitterCard: 'summary_large_image',
})
</script>
