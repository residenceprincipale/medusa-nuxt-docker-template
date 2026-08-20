<template>
  <div>
    <h1 style="margin-bottom: 1.5rem; font-size: 1.5rem">{{ t('checkout.title') }}</h1>

    <div v-if="order" class="success-box">
      <h2>{{ t('checkout.orderPlaced') }}</h2>
      <p>{{ t('checkout.orderId') }}: <strong>{{ order.id }}</strong></p>
      <NuxtLink to="/" class="btn btn-primary" style="margin-top: 1rem">{{ t('checkout.continueShopping') }}</NuxtLink>
    </div>

    <div v-else-if="cartStore.isEmpty" class="cart-empty">
      <p>{{ t('checkout.empty') }}</p>
      <NuxtLink to="/" class="btn btn-primary" style="margin-top: 1rem">{{ t('checkout.browse') }}</NuxtLink>
    </div>

    <div v-else style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
      <form class="checkout-form" @submit.prevent="placeOrder">
        <h2>{{ t('checkout.shipping') }}</h2>

        <div class="form-row">
          <div class="form-group">
            <label>{{ t('checkout.firstName') }}</label>
            <input v-model="form.first_name" required />
          </div>
          <div class="form-group">
            <label>{{ t('checkout.lastName') }}</label>
            <input v-model="form.last_name" required />
          </div>
        </div>

        <div class="form-group">
          <label>{{ t('checkout.email') }}</label>
          <input v-model="form.email" type="email" required />
        </div>

        <div class="form-group">
          <label>{{ t('checkout.address') }}</label>
          <input v-model="form.address_1" required />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>{{ t('checkout.city') }}</label>
            <input v-model="form.city" required />
          </div>
          <div class="form-group">
            <label>{{ t('checkout.postalCode') }}</label>
            <input v-model="form.postal_code" required />
          </div>
        </div>

        <div class="form-group">
          <label>{{ t('checkout.country') }}</label>
          <input v-model="form.country_code" required placeholder="US" maxlength="2" />
        </div>

        <div v-if="shippingOptions.length" class="form-group">
          <label>{{ t('checkout.shippingMethod') }}</label>
          <select v-model="selectedShipping" @change="onShippingChange">
            <option v-for="opt in shippingOptions" :key="opt.id" :value="opt.id">
              {{ opt.name }} — {{ formatMoney(opt.amount, cartStore.currency) }}
            </option>
          </select>
        </div>

        <PaymentStripe
          v-if="features.stripe && clientSecret"
          :client-secret="clientSecret"
          @confirm="onStripeConfirm"
        />

        <div class="cart-summary">
          <span>{{ t('cart.total') }}</span>
          <span>{{ formatMoney(cartStore.total, cartStore.currency) }}</span>
        </div>

        <button
          type="submit"
          class="btn btn-primary btn-block"
          style="margin-top: 1rem"
          :disabled="processing"
        >
          {{ processing ? t('checkout.processing') : t('checkout.placeOrder') }}
        </button>

        <p v-if="errorMsg" style="color: #dc2626; margin-top: 0.75rem; font-size: 0.9rem">{{ errorMsg }}</p>
      </form>

      <OrderSummary
        :items="cartStore.items"
        :total="cartStore.total"
        :currency="cartStore.currency"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const features = useFeatures()
const sdk = useMedusa()
const cartStore = useCartStore()

useHead({ title: t('checkout.title') })
useSeoMeta({ title: t('checkout.title') })

const form = reactive({
  first_name: '',
  last_name: '',
  email: '',
  address_1: '',
  city: '',
  postal_code: '',
  country_code: 'US',
})

const shippingOptions = ref<any[]>([])
const selectedShipping = ref('')
const processing = ref(false)
const errorMsg = ref('')
const order = ref<any>(null)
const clientSecret = ref('')

onMounted(async () => {
  const cart = await cartStore.ensureCart()
  if (!cart) return

  await cartStore.updateShippingAddress({ ...form })

  try {
    const { shipping_options } = await sdk.store.fulfillment.listCartOptions({ cart_id: cart.id })
    shippingOptions.value = shipping_options
    if (shipping_options.length) {
      selectedShipping.value = shipping_options[0].id
      await onShippingChange()
    }
  } catch { /* no shipping options */ }

  if (features.stripe) {
    try {
      const pc = await cartStore.createPaymentSession('stripe')
      const session = pc?.payment_sessions?.find((s: any) => s.status === 'pending')
      if (session?.client_secret) {
        clientSecret.value = session.client_secret
      }
    } catch { /* stripe not available */ }
  }
})

async function onShippingChange() {
  if (!selectedShipping.value) return
  await cartStore.setShippingMethod(selectedShipping.value)
}

async function onStripeConfirm(_paymentMethod: any) {
  await placeOrder()
}

async function placeOrder() {
  processing.value = true
  errorMsg.value = ''

  try {
    await cartStore.updateShippingAddress({ ...form })

    if (!features.stripe) {
      await cartStore.createPaymentSession('system_default')
    }

    const result = await cartStore.complete()
    if (result?.type === 'order') {
      order.value = result.order
      cartStore.clearCart()
    } else {
      errorMsg.value = result?.error?.message || t('common.error')
    }
  } catch (e: any) {
    errorMsg.value = e?.message || t('common.error')
  } finally {
    processing.value = false
  }
}

function formatMoney(amount: number | undefined, currency = 'usd'): string {
  if (amount == null) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: (currency || 'usd').toUpperCase(),
  }).format(amount / 100)
}
</script>
