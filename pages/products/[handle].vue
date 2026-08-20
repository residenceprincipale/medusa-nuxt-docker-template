<template>
  <div>
    <div v-if="pending" class="loading">{{ t('common.loading') }}</div>
    <div v-else-if="error || !product" class="error">{{ t('common.error') }}</div>

    <div v-else class="product-detail">
      <div class="product-gallery">
        <img
          :src="selectedImage || product.thumbnail || placeholder"
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
        <div style="display: flex; align-items: center; gap: 0.5rem">
          <h1 class="title">{{ product.title }}</h1>
          <WishlistButton
            v-if="features.wishlist"
            :product-id="product.id"
          />
        </div>

        <p v-if="product.description" class="description">{{ product.description }}</p>
        <div class="price">{{ formatPrice(selectedVariant) }}</div>

        <div
          v-for="option in product.options"
          :key="option.id"
          class="option-group"
        >
          <label>{{ option.title }}</label>
          <select
            :value="selectedOptions[option.id]"
            @change="onOptionChange(option.id, ($event.target as HTMLSelectElement).value)"
          >
            <option v-for="val in option.values" :key="val.id" :value="val.value">
              {{ val.value }}
            </option>
          </select>
        </div>

        <button
          class="btn btn-primary btn-block"
          :disabled="!selectedVariant || adding"
          @click="handleAdd"
        >
          {{ adding ? t('product.adding') : t('product.addToCart') }}
        </button>

        <p v-if="added" style="text-align:center; margin-top:0.75rem; color:#166534; font-size:0.9rem">
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

const placeholder = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect fill="%23eee" width="400" height="400"/><text fill="%23999" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14">No image</text></svg>'

const { data: productData, pending, error } = await useAsyncData(
  `product-${route.params.handle}`,
  async () => {
    const regionId = await useStoreRegionId()
    const { products } = await sdk.store.product.list({
      handle: route.params.handle as string,
      ...(regionId ? { region_id: regionId } : {}),
    })
    return { product: products?.[0] ?? null }
  },
)

const product = computed(() => productData.value?.product)

useHead({
  title: () => product.value?.title ?? t('common.loading'),
})

useSeoMeta({
  title: () => product.value?.title ?? t('common.loading'),
  description: () => product.value?.description ?? '',
  ogTitle: () => product.value?.title,
  ogDescription: () => product.value?.description,
  ogImage: () => product.value?.thumbnail,
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
  return product.value.variants.find((v: any) => {
    if (!v.options?.length) return true
    return v.options.every((vo: any) => selectedOptions.value[vo.option_id] === vo.value)
  }) ?? null
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
