<template>
  <div>
    <h1 style="margin-bottom: 1.5rem; font-size: 1.5rem">{{ t('cart.title') }}</h1>

    <div v-if="cartStore.isEmpty" class="cart-empty">
      <p>{{ t('cart.empty') }}</p>
      <NuxtLink to="/" class="btn btn-primary" style="margin-top: 1rem">{{ t('cart.browse') }}</NuxtLink>
    </div>

    <div v-else>
      <div
        v-for="item in cartStore.items"
        :key="item.id"
        class="cart-item"
      >
        <img :src="item.thumbnail || placeholder" :alt="item.title" />
        <div class="details">
          <div class="name">{{ item.title }}</div>
          <div class="variant">{{ item.variant_title || item.variant?.title }}</div>
        </div>
        <div class="qty-controls">
          <button @click="changeQty(item, item.quantity - 1)">-</button>
          <span>{{ item.quantity }}</span>
          <button @click="changeQty(item, item.quantity + 1)">+</button>
        </div>
        <div class="item-price">{{ formatMoney((item.unit_price ?? 0) * (item.quantity ?? 1), cartStore.currency) }}</div>
        <button class="btn-remove" @click="remove(item.id)">{{ t('cart.remove') }}</button>
      </div>

      <div v-if="features.promotions" style="margin: 1.5rem 0">
        <div style="display: flex; gap: 0.5rem; align-items: center">
          <input
            v-model="promoCode"
            type="text"
            :placeholder="t('cart.promoCode')"
          />
          <button class="btn btn-outline" @click="applyPromo">{{ t('cart.apply') }}</button>
        </div>
        <div
          v-for="promo in appliedPromos"
          :key="promo"
          style="display: flex; gap: 0.5rem; align-items: center; margin-top: 0.5rem"
        >
          <span>{{ promo }}</span>
          <button class="btn-remove" @click="removePromo(promo)">{{ t('cart.removePromo') }}</button>
        </div>
      </div>

      <div class="cart-summary">
        <span>{{ t('cart.total') }}</span>
        <span>{{ formatMoney(cartStore.total, cartStore.currency) }}</span>
      </div>

      <div class="cart-actions">
        <NuxtLink to="/checkout" class="btn btn-primary">{{ t('cart.checkout') }}</NuxtLink>
        <NuxtLink to="/" class="btn btn-outline">{{ t('cart.continueShopping') }}</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const features = useFeatures()
const cartStore = useCartStore()

const placeholder = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect fill="%23eee" width="80" height="80"/></svg>'

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
