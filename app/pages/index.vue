<template>
  <div>
    <h1 class="page-title">{{ t('home.title') }}</h1>

    <div v-if="features.search" class="toolbar-item">
      <SearchBar @search="onSearch" />
    </div>

    <div v-if="features.categories && categories.length" class="toolbar-item">
      <CategoryFilter :categories="categories" :selected="selectedCategory" @select="onCategorySelect" />
    </div>

    <div class="toolbar-item">
      <UiSelect v-model="sortBy">
        <option value="">{{ t('common.currency') }}</option>
        <option value="-created_at">Newest</option>
        <option value="created_at">Oldest</option>
        <option value="title">Name: A-Z</option>
        <option value="-title">Name: Z-A</option>
      </UiSelect>
    </div>

    <div v-if="pending" class="product-grid">
      <div v-for="n in 8" :key="n" class="skeleton-card">
        <div class="skeleton-card__image shimmer" />
        <div class="skeleton-card__title shimmer" />
        <div class="skeleton-card__price shimmer" />
      </div>
    </div>
    <div v-else-if="error" class="error">{{ t('common.error') }}</div>
    <div v-else-if="products.length === 0" class="cart-empty">{{ t('home.empty') }}</div>

    <div v-else class="product-grid">
      <ProductCard v-for="p in products" :key="p.id" :product="p" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { HttpTypes } from '@medusajs/types'

const { t } = useI18n()
const features = useFeatures()
const sdk = useMedusa()

useHead({
  title: t('home.title'),
})

useSeoMeta({
  title: t('home.title'),
  description: t('home.empty'),
  ogTitle: t('home.title'),
})

const sortBy = ref('')
const selectedCategory = ref('')
const searchQuery = ref('')

const { data, pending, error } = await useAsyncData(
  'products',
  async () => {
    const params: HttpTypes.StoreProductListParams = {}
    if (searchQuery.value) params.q = searchQuery.value
    if (selectedCategory.value) {
      const cat = categories.value.find((c) => c.handle === selectedCategory.value)
      if (cat) params.category_id = [cat.id]
    }
    if (sortBy.value) params.order = sortBy.value
    const regionId = await useStoreRegionId()
    return sdk.store.product.list({
      ...params,
      ...(regionId ? { region_id: regionId } : {}),
    })
  },
  { watch: [searchQuery, sortBy, selectedCategory] },
)

const products = computed(() => data.value?.products ?? [])

const { data: categoryData } = await useAsyncData('categories', async () => {
  if (!features.categories) return { product_categories: [] }
  return sdk.store.category.list()
})

const categories = computed(() => categoryData.value?.product_categories ?? [])

function onSearch(query: string) {
  searchQuery.value = query
}

function onCategorySelect(handle: string) {
  selectedCategory.value = handle
}
</script>

<style scoped>
.skeleton-card__image {
  width: 100%;
  aspect-ratio: 1;
  margin-bottom: 0.5rem;
}
.skeleton-card__title {
  width: 70%;
  height: 1rem;
  margin-bottom: 0.35rem;
}
.skeleton-card__price {
  width: 40%;
  height: 0.85rem;
}
.shimmer {
  background: linear-gradient(90deg, #eee 25%, #f5f5f5 37%, #eee 63%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
}
@keyframes shimmer {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: 0 0;
  }
}
.page-title {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 700;
}
.toolbar-item {
  margin-bottom: 1rem;
}
</style>
