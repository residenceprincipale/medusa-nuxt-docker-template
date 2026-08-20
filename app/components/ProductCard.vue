<template>
  <NuxtLink :to="`/products/${product.handle}`" class="product-card">
    <div class="product-card__image">
      <img :src="product.thumbnail || '/no-image.svg'" :alt="product.title" loading="lazy" />
    </div>

    <div class="product-card__info">
      <h3 class="product-card__title">{{ product.title }}</h3>

      <p class="product-card__price">
        {{ formatPrice(product) }}
      </p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { Product } from '~/types/medusa'

const { t } = useI18n()

const props = defineProps<{
  product: Product
}>()

function formatPrice(product: Product): string {
  const amount = product?.variants?.[0]?.calculated_price?.calculated_amount
  const currency = product?.variants?.[0]?.calculated_price?.currency_code?.toUpperCase() ?? 'USD'
  if (amount == null || Number.isNaN(amount)) return ''
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}
</script>

<style scoped>
.product-card {
  display: block;
  text-decoration: none;
  color: inherit;
}
.product-card__image {
  width: 100%;
  aspect-ratio: 1;
  background: #f2f2f2;
  margin-bottom: 0.5rem;
  overflow: hidden;
}
.product-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.product-card__info {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}
.product-card__title {
  font-weight: 600;
}
.product-card__price {
  color: var(--muted);
  white-space: nowrap;
}
</style>
