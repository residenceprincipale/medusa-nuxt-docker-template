<template>
  <div v-if="features.auth">
    <h1 style="margin-bottom: 1.5rem; font-size: 1.5rem">{{ t('account.title') }}</h1>

    <div v-if="!authStore.isLoggedIn" class="cart-empty">
      <p>{{ t('auth.loginTitle') }}</p>
      <NuxtLink to="/auth/login" class="btn btn-primary" style="margin-top: 1rem">{{ t('auth.loginButton') }}</NuxtLink>
    </div>

    <div v-else-if="authStore.customer">
      <div class="account-section">
        <h2>{{ t('account.profile') }}</h2>
        <p><strong>{{ authStore.customer.first_name }} {{ authStore.customer.last_name }}</strong></p>
        <p>{{ authStore.customer.email }}</p>
      </div>

      <div v-if="features.orderTracking" class="account-section">
        <h2>{{ t('account.orders') }}</h2>
        <div v-if="!orders.length" class="cart-empty">{{ t('account.noOrders') }}</div>
        <div v-else>
          <NuxtLink
            v-for="o in orders"
            :key="o.id"
            :to="`/orders/${o.id}`"
            class="order-item"
          >
            <span>{{ o.id }}</span>
            <span>{{ formatMoney(o.total, o.currency_code) }}</span>
            <span>{{ o.status }}</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const features = useFeatures()
const authStore = useAuthStore()
const sdk = useMedusa()

useHead({ title: t('account.title') })
useSeoMeta({ title: t('account.title') })

const orders = ref<any[]>([])

onMounted(async () => {
  if (!authStore.isLoggedIn) {
    useRouter().push('/auth/login')
    return
  }
  await authStore.fetchCustomer()

  if (features.orderTracking && authStore.customer?.orders) {
    orders.value = authStore.customer.orders
  }
})

function formatMoney(amount: number | undefined, currency = 'usd'): string {
  if (amount == null) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: (currency || 'usd').toUpperCase(),
  }).format(amount / 100)
}
</script>
