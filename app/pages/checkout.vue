<template>
  <div>
    <h1 class="page-title">{{ t('checkout.title') }}</h1>

    <div v-if="order" class="success-box">
      <h2>{{ t('checkout.orderPlaced') }}</h2>
      <p>
        {{ t('checkout.orderId') }}: <strong>{{ order.id }}</strong>
      </p>
      <UiButton to="/" class="checkout-cta">{{ t('checkout.continueShopping') }}</UiButton>
    </div>

    <div v-else-if="cartStore.isEmpty" class="cart-empty">
      <p>{{ t('checkout.empty') }}</p>
      <UiButton to="/" class="checkout-cta">{{ t('checkout.browse') }}</UiButton>
    </div>

    <div v-else class="checkout-grid">
      <form class="checkout-form" @submit.prevent="placeOrder">
        <h2>{{ t('checkout.shipping') }}</h2>

        <div class="form-row">
          <div class="form-group">
            <label>{{ t('checkout.firstName') }}</label>
            <UiInput v-model="form.first_name" required />
          </div>
          <div class="form-group">
            <label>{{ t('checkout.lastName') }}</label>
            <UiInput v-model="form.last_name" required />
          </div>
        </div>

        <div class="form-group">
          <label>{{ t('checkout.email') }}</label>
          <UiInput v-model="form.email" type="email" required />
        </div>

        <div class="form-group">
          <label>{{ t('checkout.address') }}</label>
          <UiInput v-model="form.address_1" required />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>{{ t('checkout.city') }}</label>
            <UiInput v-model="form.city" required />
          </div>
          <div class="form-group">
            <label>{{ t('checkout.postalCode') }}</label>
            <UiInput v-model="form.postal_code" required />
          </div>
        </div>

        <div class="form-group">
          <label>{{ t('checkout.country') }}</label>
          <UiInput v-model="form.country_code" required placeholder="US" maxlength="2" />
        </div>

        <div v-if="shippingOptions.length" class="form-group">
          <label>{{ t('checkout.shippingMethod') }}</label>
          <UiSelect :model-value="selectedShipping" @update:modelValue="onShippingChange">
            <option v-for="opt in shippingOptions" :key="opt.id" :value="opt.id">
              {{ opt.name }} — {{ formatMoney(opt.amount, cartStore.currency) }}
            </option>
          </UiSelect>
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

        <UiButton type="submit" block class="checkout-cta" :disabled="processing">
          {{ processing ? t('checkout.processing') : t('checkout.placeOrder') }}
        </UiButton>

        <p v-if="errorMsg" class="checkout-error">{{ errorMsg }}</p>
      </form>

      <OrderSummary :items="cartStore.items" :total="cartStore.total" :currency="cartStore.currency" />
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
  } catch {
    /* no shipping options */
  }

  if (features.stripe) {
    try {
      const pc = await cartStore.createPaymentSession('stripe')
      const session = pc?.payment_sessions?.find((s: any) => s.status === 'pending')
      if (session?.client_secret) {
        clientSecret.value = session.client_secret
      }
    } catch {
      /* stripe not available */
    }
  }
})

async function onShippingChange(val: string) {
  if (!val) return
  selectedShipping.value = val
  await cartStore.setShippingMethod(val)
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
  }).format(amount)
}
</script>

<style scoped>
.checkout-form {
  max-width: 48ch;
}
.checkout-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}
.checkout-cta {
  margin-top: 1rem;
}
.checkout-error {
  color: var(--error);
  margin-top: 0.75rem;
  font-size: 0.9rem;
}
.checkout-form h2 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
}
.success-box {
  border: 1px solid var(--border);
  padding: 2rem;
  text-align: center;
}
.success-box h2 {
  margin-bottom: 0.5rem;
}
</style>
