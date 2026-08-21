<template>
  <div>
    <div v-if="pending" class="loading">{{ t('common.loading') }}</div>
    <div v-else-if="error" class="error">{{ t('common.error') }}</div>
    <div v-else-if="!categories.length" class="cart-empty">{{ t('home.empty') }}</div>

    <div v-else class="category-grid">
      <NuxtLink v-for="c in categories" :key="c.id" :to="`/categories/${c.handle}`" class="category-card">
        <span>{{ c.name }}</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const sdk = useMedusa()

useHead({ title: t('footer.categories') })
useSeoMeta({ title: t('footer.categories') })

const { data, pending, error } = await useAsyncData('all-categories', async () => {
  const { product_categories } = await sdk.store.category.list()
  return product_categories
})

const categories = computed(() => data.value ?? [])
</script>

<style scoped>
.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}
.category-card {
  display: block;
  padding: 1.5rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  text-decoration: none;
  font-size: 1rem;
}
</style>
