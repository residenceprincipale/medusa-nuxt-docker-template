<template>
  <div>
    <div v-if="pending" class="loading">{{ t('common.loading') }}</div>
    <div v-else-if="error || !product" class="error">{{ t('common.error') }}</div>

    <div v-else class="product-detail">
      <div class="product-gallery">
        <img
          :src="selectedImage || product.thumbnail || product.images?.[0]?.url || '/no-image.svg'"
          :alt="product.title"
          class="product-gallery__main"
        />
        <div v-if="product.images?.length" class="product-gallery__thumbs">
          <button
            v-for="(img, idx) in product.images"
            :key="idx"
            class="product-gallery__thumb"
            :class="{ active: selectedImage === img.url }"
            @click="selectedImage = img.url"
          >
            <img :src="img.url" :alt="`${product.title} ${idx + 1}`" />
          </button>
        </div>
      </div>

      <div>
        <div class="product-title-row">
          <h1 class="title">{{ product.title }}</h1>
          <WishlistButton v-if="features.wishlist" :product-id="product.id" />
        </div>

        <p v-if="product.description" class="description">{{ product.description }}</p>
        <div class="price">{{ formatPrice(selectedVariant) }}</div>

        <div v-for="option in product.options" :key="option.id" class="option-group">
          <label>{{ option.title }}</label>
          <UiSelect :model-value="selectedOptions[option.id]" @update:modelValue="onOptionChange(option.id, $event)">
            <option v-for="val in option.values" :key="val.id" :value="val.value">
              {{ val.value }}
            </option>
          </UiSelect>
        </div>

        <UiButton block :disabled="!selectedVariant || adding" @click="handleAdd">
          {{ adding ? t('product.adding') : t('product.addToCart') }}
        </UiButton>

        <p v-if="added" class="add-success">
          {{ t('product.added') }}
        </p>
      </div>
    </div>

    <div v-if="features.reviews && product" class="reviews-section">
      <h2>{{ t('product.reviews') }}</h2>
      <ReviewList :reviews="product.reviews || []" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const features = useFeatures()
const sdk = useMedusa()
const { addItem } = useCartStore()

const {
  data: productData,
  pending,
  error,
} = await useAsyncData(`product-${route.params.handle}`, async () => {
  const regionId = await useStoreRegionId()
  const { products } = await sdk.store.product.list({
    handle: route.params.handle as string,
    ...(regionId ? { region_id: regionId } : {}),
  })
  return { product: products?.[0] ?? null }
})

const product = computed(() => productData.value?.product)

useHead({
  title: () => product.value?.title ?? t('common.loading'),
})

useSeoMeta({
  title: () => product.value?.title ?? t('common.loading'),
  description: () => product.value?.description ?? '',
  ogTitle: () => product.value?.title,
  ogDescription: () => product.value?.description,
  ogImage: () => product.value?.thumbnail || product.value?.images?.[0]?.url,
})

const selectedImage = ref<string | null>(null)
const selectedOptions = ref<Record<string, string>>({})
const adding = ref(false)
const added = ref(false)

watchEffect(() => {
  if (product.value?.options?.length) {
    const opts: Record<string, string> = {}
    for (const o of product.value.options) {
      if (!selectedOptions.value[o.id] && o.values?.length) {
        opts[o.id] = o.values[0].value
      }
    }
    if (Object.keys(opts).length) {
      selectedOptions.value = { ...selectedOptions.value, ...opts }
    }
  }
})

const selectedVariant = computed(() => {
  if (!product.value?.variants?.length) return null
  return (
    product.value.variants.find((v: any) => {
      if (!v.options?.length) return true
      return v.options.every((vo: any) => selectedOptions.value[vo.option_id] === vo.value)
    }) ?? null
  )
})

function onOptionChange(optionId: string, value: string) {
  selectedOptions.value = { ...selectedOptions.value, [optionId]: value }
  added.value = false
}

async function handleAdd() {
  if (!selectedVariant.value) return
  adding.value = true
  added.value = false
  try {
    await addItem(selectedVariant.value.id)
    added.value = true
  } finally {
    adding.value = false
  }
}

function formatPrice(v: any): string {
  const amount = v?.calculated_price?.calculated_amount
  if (amount == null || Number.isNaN(amount)) return ''
  const currency = v?.calculated_price?.currency_code?.toUpperCase() ?? 'USD'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
}
</script>

<style scoped>
.product-detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: start;
  margin-top: 2rem;
}
.product-gallery__main {
  width: 100%;
  background: #f2f2f2;
}
.product-gallery__thumbs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.75rem;
}
.product-gallery__thumb {
  width: 64px;
  height: 64px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
}
.product-gallery__thumb img {
  width: 64px;
  height: 64px;
  object-fit: cover;
}
.product-gallery__thumb.active img {
  outline: 1px solid var(--fg);
}
.product-detail .title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}
.product-detail .description {
  color: var(--muted);
  margin-bottom: 1rem;
  max-width: 50ch;
}
.product-detail .price {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}
.reviews-section {
  margin-top: 3rem;
}
.reviews-section h2 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

@media (max-width: 700px) {
  .product-detail {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
.product-title-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.add-success {
  text-align: center;
  margin-top: 0.75rem;
  color: var(--success);
  font-size: 0.9rem;
}
</style>
