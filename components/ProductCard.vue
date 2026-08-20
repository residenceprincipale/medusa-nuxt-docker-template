<template>
  <NuxtLink :to="`/products/${product.handle}`" class="product-card">
    <div class="product-card__image">
      <img
        :src="product.thumbnail || '/placeholder.png'"
        :alt="product.title"
        loading="lazy"
      />
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

const { t } = useI18n()

const props = defineProps<{
  product: any
}>()

function formatPrice(product: any): string {
  const amount = product?.variants?.[0]?.calculated_price?.calculated_amount
  const currency = product?.variants?.[0]?.calculated_price?.currency_code?.toUpperCase() ?? 'USD'
  if (amount == null || Number.isNaN(amount)) return ''
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}
</script>
