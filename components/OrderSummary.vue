<template>
  <div class="order-summary">
    <h2>{{ t('order.summary') }}</h2>

    <ul class="order-summary__items">
      <li v-for="item in items" :key="item.id" class="order-summary__item">
        <img
          :src="item.thumbnail || '/placeholder.png'"
          :alt="item.title"
          class="order-summary__image"
        />

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
      <span>{{ t('order.total') }}</span>
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
  }).format(amount / 100)
}
</script>
