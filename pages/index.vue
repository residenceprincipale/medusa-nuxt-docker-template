<template>
  <div>
    <h1 style="margin-bottom: 1.5rem; font-size: 1.5rem">{{ t('home.title') }}</h1>

    <div v-if="features.search" style="margin-bottom: 1rem">
      <SearchBar @search="onSearch" />
    </div>

    <div v-if="features.categories && categories.length" style="margin-bottom: 1rem">
      <CategoryFilter
        :categories="categories"
        :selected="selectedCategory"
        @select="onCategorySelect"
      />
    </div>

    <div style="margin-bottom: 1rem">
      <select v-model="sortBy">
        <option value="">{{ t('common.currency') }}</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="created_at">Newest</option>
        <option value="title_asc">Name: A-Z</option>
      </select>
    </div>

    <div v-if="pending" class="loading">{{ t('home.loading') }}</div>
    <div v-else-if="error" class="error">{{ t('common.error') }}</div>
    <div v-else-if="products.length === 0" class="cart-empty">{{ t('home.empty') }}</div>

    <div v-else class="product-grid">
      <ProductCard v-for="p in products" :key="p.id" :product="p" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

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

const { data, pending, error } = await useAsyncData('products', async () => {
  const params: Record<string, any> = {}
  if (searchQuery.value) params.q = searchQuery.value
  if (sortBy.value) {
    const [field, order] = sortBy.value.split('_')
    params.order = `${field}_${order === 'asc' ? 'asc' : 'desc'}`
  }
  const regionId = await useStoreRegionId()
  return sdk.store.product.list({
    ...params,
    ...(regionId ? { region_id: regionId } : {}),
  })
}, { watch: [searchQuery, sortBy] })

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
