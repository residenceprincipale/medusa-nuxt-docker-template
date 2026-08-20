<template>
  <div>
    <h1 class="page-title">{{ t('cart.title') }}</h1>

    <div v-if="cartStore.isEmpty" class="cart-empty">
      <p>{{ t('cart.empty') }}</p>
      <UiButton to="/" class="cart-browse">{{ t('cart.browse') }}</UiButton>
    </div>

    <div v-else>
      <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
        <img :src="item.thumbnail || item.images?.[0]?.url || '/no-image.svg'" :alt="item.title" />
        <div class="details">
          <div class="name">{{ item.title }}</div>
          <div class="variant">{{ item.variant_title || item.variant?.title }}</div>
        </div>
        <div class="qty-controls">
          <button @click="changeQty(item, item.quantity - 1)">-</button>
          <span>{{ item.quantity }}</span>
          <button @click="changeQty(item, item.quantity + 1)">+</button>
        </div>
        <div class="item-price">
          {{ formatMoney((item.unit_price ?? 0) * (item.quantity ?? 1), cartStore.currency) }}
        </div>
        <UiButton variant="remove" @click="remove(item.id)">{{ t('cart.remove') }}</UiButton>
      </div>

      <div v-if="features.promotions" class="promo-block">
        <div class="promo-row">
          <UiInput v-model="promoCode" type="text" :placeholder="t('cart.promoCode')" />
          <UiButton variant="outline" @click="applyPromo">{{ t('cart.apply') }}</UiButton>
        </div>
        <div
          v-for="promo in appliedPromos"
          :key="promo"
          class="promo-row promo-row--stacked"
        >
          <span>{{ promo }}</span>
          <UiButton variant="remove" @click="removePromo(promo)">{{ t('cart.removePromo') }}</UiButton>
        </div>
      </div>

      <div class="cart-summary">
        <span>{{ t('cart.total') }}</span>
        <span>{{ formatMoney(cartStore.total, cartStore.currency) }}</span>
      </div>

      <div class="cart-actions">
        <UiButton to="/checkout">{{ t('cart.checkout') }}</UiButton>
        <UiButton to="/" variant="outline">{{ t('cart.continueShopping') }}</UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const features = useFeatures()
const cartStore = useCartStore()

useHead({ title: t('cart.title') })
useSeoMeta({ title: t('cart.title') })

const promoCode = ref('')
const appliedPromos = ref<string[]>([])

onMounted(() => cartStore.ensureCart())

async function changeQty(item: any, qty: number) {
  if (qty < 1) {
    await cartStore.removeItem(item.id)
  } else {
    await cartStore.updateItem(item.id, qty)
  }
}

async function remove(lineItemId: string) {
  await cartStore.removeItem(lineItemId)
}

async function applyPromo() {
  if (!promoCode.value.trim()) return
  await cartStore.addPromotion(promoCode.value.trim())
  appliedPromos.value.push(promoCode.value.trim())
  promoCode.value = ''
}

async function removePromo(code: string) {
  await cartStore.removePromotion(code)
  appliedPromos.value = appliedPromos.value.filter((p) => p !== code)
}

function formatMoney(amount: number | undefined, currency = 'usd'): string {
  if (amount == null) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: (currency || 'usd').toUpperCase(),
  }).format(amount)
}
</script>

<style scoped>
.cart-item {
  display: flex;
  gap: 1rem;
  padding: 1.25rem 0;
  border-bottom: 1px solid var(--border);
  align-items: center;
}
.cart-item img {
  width: 72px;
  height: 72px;
  object-fit: cover;
  background: #f2f2f2;
}
.cart-item .details {
  flex: 1;
}
.cart-item .name {
  font-weight: 600;
}
.cart-item .variant {
  color: var(--muted);
  font-size: 0.85rem;
}
.cart-item .qty-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.cart-item .qty-controls button {
  width: 26px;
  height: 26px;
  border: 1px solid var(--border);
  background: #fff;
  cursor: pointer;
  font-family: inherit;
}
.cart-item .item-price {
  font-weight: 600;
  min-width: 70px;
  text-align: right;
}
.cart-actions {
  margin-top: 1.5rem;
  display: flex;
  gap: 0.75rem;
}
.page-title {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 700;
}
.cart-browse {
  margin-top: 1rem;
}
.promo-block {
  margin: 1.5rem 0;
}
.promo-row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.promo-row--stacked {
  margin-top: 0.5rem;
}
</style>
