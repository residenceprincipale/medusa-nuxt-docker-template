<template>
  <div v-if="features.wishlist">
    <h1 style="margin-bottom: 1.5rem; font-size: 1.5rem">{{ t('wishlist.title') }}</h1>

    <div v-if="!wishlistIds.length" class="cart-empty">{{ t('wishlist.empty') }}</div>

    <div v-else-if="loading" class="loading">{{ t('common.loading') }}</div>

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

useHead({ title: t('wishlist.title') })
useSeoMeta({ title: t('wishlist.title') })

const wishlistIds = ref<string[]>([])
const products = ref<any[]>([])
const loading = ref(false)

onMounted(async () => {
  const stored = localStorage.getItem('wishlist')
  if (stored) {
    wishlistIds.value = JSON.parse(stored)
  }

  if (wishlistIds.value.length) {
    loading.value = true
    try {
      const regionId = await useStoreRegionId()
      const results = await Promise.all(
        wishlistIds.value.map((id) =>
          sdk.store.product.retrieve(id, {
            ...(regionId ? { region_id: regionId } : {}),
          }),
        ),
      )
      products.value = results.map((r) => r.product).filter(Boolean)
    } catch {
      products.value = []
    } finally {
      loading.value = false
    }
  }
})
</script>
