<template>
  <div v-if="features.categories">
    <div v-if="pending" class="loading">{{ t('common.loading') }}</div>
    <div v-else-if="error || !category" class="error">{{ t('common.error') }}</div>

    <div v-else>
      <h1 class="category-title">{{ category.name }}</h1>
      <p v-if="category.description" class="category-desc">{{ category.description }}</p>

      <div v-if="productsPending" class="loading">{{ t('common.loading') }}</div>
      <div v-else-if="!products.length" class="cart-empty">{{ t('home.empty') }}</div>

      <div v-else class="product-grid">
        <ProductCard v-for="p in products" :key="p.id" :product="p" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const features = useFeatures()
const sdk = useMedusa()
const route = useRoute()

const {
  data: categoryData,
  pending,
  error,
} = await useAsyncData(`category-${route.params.handle}`, async () => {
  const { product_categories } = await sdk.store.category.list()
  return product_categories.find((c) => c.handle === route.params.handle) ?? null
})

const category = computed(() => categoryData.value)
useHead({ title: () => category.value?.name ?? t('common.loading') })
useSeoMeta({
  title: () => category.value?.name ?? t('common.loading'),
  description: () => category.value?.description ?? '',
})

const { data: productData, pending: productsPending } = await useAsyncData(
  `category-products-${route.params.handle}`,
  async () => {
    if (!category.value) return { products: [] }
    const regionId = await useStoreRegionId()
    return sdk.store.product.list({
      category_id: [category.value.id],
      ...(regionId ? { region_id: regionId } : {}),
    })
  },
  { watch: [category] },
)

const products = computed(() => productData.value?.products ?? [])
</script>

<style scoped>
.category-title {
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}
.category-desc {
  margin-bottom: 1.5rem;
  color: var(--muted);
}
</style>
