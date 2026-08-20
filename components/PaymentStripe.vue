<template>
  <div v-if="features.stripe" class="stripe-element">
    <div ref="cardContainer" />

    <p v-if="error" class="stripe-element__error">{{ error }}</p>

    <UiButton :disabled="processing || !cardMounted" @click="confirmPayment">
      {{ processing ? t('payment.processing') : t('payment.pay') }}
    </UiButton>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { loadStripe, type Stripe, type StripeCardElement } from '@stripe/stripe-js'

const { t } = useI18n()
const features = useFeatures()

const props = defineProps<{
  clientSecret: string
}>()

const emit = defineEmits<{
  confirm: [paymentMethod: any]
}>()

const cardContainer = ref<HTMLElement | null>(null)
const error = ref('')
const processing = ref(false)
const cardMounted = ref(false)

let stripe: Stripe | null = null
let cardElement: StripeCardElement | null = null

onMounted(async () => {
  if (!features.stripe) return

  try {
    const pk = useRuntimeConfig().public.stripePublishableKey as string
    stripe = await loadStripe(pk)

    if (stripe && cardContainer.value) {
      const elements = stripe.elements({ clientSecret: props.clientSecret })
      cardElement = elements.create('card')
      cardElement.mount(cardContainer.value)
      cardElement.on('change', (event) => {
        error.value = event.error?.message || ''
      })
      cardMounted.value = true
    }
  } catch {
    error.value = t('payment.stripeInitError')
  }
})

async function confirmPayment() {
  if (!stripe || !cardElement) return

  processing.value = true
  error.value = ''

  try {
    const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    })

    if (stripeError) {
      error.value = stripeError.message || t('payment.genericError')
    } else {
      emit('confirm', paymentMethod)
    }
  } catch {
    error.value = t('payment.genericError')
  } finally {
    processing.value = false
  }
}

onBeforeUnmount(() => {
  cardElement?.destroy()
})
</script>

<style scoped>
.stripe-element {
  padding: 0.6rem;
  border: 1px solid var(--border);
  background: #fff;
}
.stripe-element__error {
  color: #c00;
  font-size: 0.85rem;
  margin-top: 0.5rem;
}
</style>
