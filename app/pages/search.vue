<template>
  <div v-if="features.search">
    <h1 class="page-title">{{ t('search.title') }}</h1>

    <div class="search-bar-block">
      <SearchBar @search="onSearch" />
    </div>

    <div v-if="pending" class="loading">{{ t('common.loading') }}</div>
    <div v-else-if="query && !products.length" class="cart-empty">{{ t('search.noResults') }}</div>

    <div v-else-if="products.length" class="product-grid">
      <ProductCard v-for="p in products" :key="p.id" :product="p" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const features = useFeatures()
const sdk = useMedusa()

useHead({ title: t('search.title') })
useSeoMeta({ title: t('search.title') })

const query = ref('')
const products = ref<any[]>([])
const pending = ref(false)

async function onSearch(q: string) {
  query.value = q
  if (!q) {
    products.value = []
    return
  }
  pending.value = true
  try {
    const regionId = await useStoreRegionId()
    const result = await sdk.store.product.list({
      q,
      ...(regionId ? { region_id: regionId } : {}),
    })
    products.value = result.products ?? []
  } catch {
    products.value = []
  } finally {
    pending.value = false
  }
}
</script>

<style scoped>
.page-title {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 700;
}
.search-bar-block {
  margin-bottom: 1.5rem;
}
</style>
