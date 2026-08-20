<template>
  <div class="order-summary">
    <h2>{{ t('checkout.orderSummary') }}</h2>

    <ul class="order-summary__items">
      <li v-for="item in items" :key="item.id" class="order-summary__item">
        <img :src="item.thumbnail || item.images?.[0]?.url || '/no-image.svg'" :alt="item.title" class="order-summary__image" />

        <div class="order-summary__details">
          <span class="order-summary__name">{{ item.title }}</span>
          <span class="order-summary__qty">x{{ item.quantity }}</span>
        </div>

        <span class="order-summary__price">
          {{ formatMoney(item.unit_price * item.quantity) }}
        </span>
      </li>
    </ul>

    <div class="order-summary__total">
      <span>{{ t('cart.total') }}</span>
      <span>{{ formatMoney(total) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps<{
  items: any[]
  total: number
  currency: string
}>()

function formatMoney(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}
</script>

<style scoped>
.order-summary {
  border-top: 1px solid var(--fg);
  padding-top: 1rem;
}
.order-summary h2 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
}
.order-summary__items {
  list-style: none;
}
.order-summary__item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border);
}
.order-summary__image {
  width: 48px;
  height: 48px;
  object-fit: cover;
  background: #f2f2f2;
}
.order-summary__details {
  flex: 1;
}
.order-summary__name {
  font-weight: 600;
}
.order-summary__qty {
  color: var(--muted);
  font-size: 0.85rem;
}
.order-summary__price {
  font-weight: 600;
}
.order-summary__total {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  font-weight: 700;
}
</style>
