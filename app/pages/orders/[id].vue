<template>
  <div v-if="features.orderTracking">
    <h1 class="page-title">{{ t('orderTracking.title') }}</h1>

    <div v-if="pending" class="loading">{{ t('common.loading') }}</div>
    <div v-else-if="error || !order" class="error">{{ t('orderTracking.notFound') }}</div>

    <div v-else class="order-detail">
      <div class="order-detail__header">
        <h2>{{ t('orderTracking.orderId') }}: {{ order.id }}</h2>
        <span class="order-detail__status">{{ order.status }}</span>
      </div>

      <p class="order-detail__date">
        {{ t('orderTracking.date') }}: {{ new Date(order.created_at).toLocaleDateString() }}
      </p>

      <div class="order-detail__items">
        <div v-for="item in order.items" :key="item.id" class="order-detail__item">
          <img :src="item.thumbnail || '/no-image.svg'" :alt="item.title" />
          <div class="details">
            <div class="name">{{ item.title }}</div>
            <div class="variant">{{ item.variant_title || item.variant?.title }}</div>
            <div class="qty">x{{ item.quantity }}</div>
          </div>
          <div class="item-price">{{ formatMoney(item.unit_total, order.currency_code) }}</div>
        </div>
      </div>

      <div class="cart-summary">
        <span>{{ t('orderTracking.total') }}</span>
        <span>{{ formatMoney(order.total, order.currency_code) }}</span>
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

useHead({ title: t('orderTracking.title') })
useSeoMeta({ title: t('orderTracking.title') })

const {
  data: orderData,
  pending,
  error,
} = await useAsyncData(`order-${route.params.id}`, () => sdk.store.order.retrieve(route.params.id as string))

const order = computed(() => orderData.value?.order)

function formatMoney(amount: number | undefined, currency = 'usd'): string {
  if (amount == null) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: (currency || 'usd').toUpperCase(),
  }).format(amount)
}
</script>

<style scoped>
.order-detail__header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 0.5rem;
}
.order-detail__status {
  color: var(--muted);
  font-size: 0.9rem;
}
.order-detail__date {
  color: var(--muted);
  margin-bottom: 1.5rem;
}
.order-detail__items {
  border-top: 1px solid var(--border);
}
.order-detail__item {
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border);
  align-items: center;
}
.order-detail__item img {
  width: 72px;
  height: 72px;
  object-fit: cover;
  background: #f2f2f2;
}
.order-detail__item .details {
  flex: 1;
}
.order-detail__item .name {
  font-weight: 600;
}
.order-detail__item .variant {
  color: var(--muted);
  font-size: 0.85rem;
}
.order-detail__item .qty {
  color: var(--muted);
  font-size: 0.85rem;
}
.order-detail__item .item-price {
  font-weight: 600;
  min-width: 70px;
  text-align: right;
}
.page-title {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 700;
}
</style>
